import {
  InvalidRequestError,
  UpstreamFailureError,
  ServerTimer,
  serverTimingHeader,
} from '@atproto/xrpc-server'
import { ResponseType, XRPCError } from '@atproto/xrpc'
import {
  DidDocument,
  PoorlyFormattedDidDocumentError,
  getFeedGen,
} from '@atproto/identity'
import { AtpAgent, AppBskyFeedGetFeedSkeleton } from '@atproto/api'
import { QueryParams as GetFeedParams } from '../../../../lexicon/types/app/bsky/feed/getFeed'
import { OutputSchema as SkeletonOutput } from '../../../../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { SkeletonFeedPost } from '../../../../lexicon/types/app/bsky/feed/defs'
import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'
import { AlgoResponse } from '../../../../feed-gen/types'
import { Database } from '../../../../db'
import {
  FeedHydrationState,
  FeedRow,
  FeedService,
} from '../../../../services/feed'
import { createPipeline } from '../../../../pipeline'

export default function (server: Server, ctx: AppContext) {
  const getFeed = createPipeline(
    skeleton,
    hydration,
    noBlocksOrMutes,
    presentation,
  )
  server.app.bsky.feed.getFeed({
    auth: ctx.authVerifierAnyAudience,
    handler: async ({ params, auth, req }) => {
      const db = ctx.db.getReplica()
      const feedService = ctx.services.feed(db)
      const viewer = auth.credentials.did

      const { timerSkele, timerHydr, ...result } = await getFeed(
        { ...params, viewer },
        {
          db,
          feedService,
          appCtx: ctx,
          authorization: req.headers['authorization'],
        },
      )

      return {
        encoding: 'application/json',
        body: result,
        headers: {
          'server-timing': serverTimingHeader([timerSkele, timerHydr]),
        },
      }
    },
  })
}

const skeleton = async (
  params: Params,
  ctx: Context,
): Promise<SkeletonState> => {
  const timerSkele = new ServerTimer('skele').start()
  const { db } = ctx
  const localAlgo = ctx.appCtx.algos[params.feed]
  const feedParams: GetFeedParams = {
    feed: params.feed,
    limit: params.limit,
    cursor: params.cursor,
  }
  const skeleton =
    localAlgo !== undefined
      ? await localAlgo(ctx.appCtx, params, params.viewer)
      : await skeletonFromFeedGen(ctx.appCtx, db, feedParams, ctx.authorization)
  const { feed, cursor, ...passthrough } = skeleton
  return {
    params,
    cursor,
    feedSkele: feed,
    timerSkele: timerSkele.stop(),
    passthrough,
  }
}

const hydration = async (state: SkeletonState, ctx: Context) => {
  const timerHydr = new ServerTimer('hydr').start()
  const { feedService } = ctx
  const { params, feedSkele } = state
  const feedItems = await cleanFeedSkeleton(feedSkele, ctx)
  const refs = feedService.feedItemRefs(feedItems)
  const hydrated = await feedService.feedHydration({
    ...refs,
    viewer: params.viewer,
  })
  return { ...state, ...hydrated, feedItems, timerHydr: timerHydr.stop() }
}

const noBlocksOrMutes = (state: HydrationState) => {
  const { viewer } = state.params
  state.feedItems = state.feedItems.filter(
    (item) =>
      !state.bam.block([viewer, item.postAuthorDid]) &&
      !state.bam.block([viewer, item.originatorDid]) &&
      !state.bam.mute([viewer, item.postAuthorDid]) &&
      !state.bam.mute([viewer, item.originatorDid]),
  )
  return state
}

const presentation = (state: HydrationState, ctx: Context) => {
  const { feedService } = ctx
  const { feedItems, cursor, passthrough } = state
  const feed = feedService.views.formatFeed(
    feedItems,
    state.actors,
    state.posts,
    state.embeds,
    state.labels,
    state.blocks,
  )
  return {
    feed,
    cursor,
    timerSkele: state.timerSkele,
    timerHydr: state.timerHydr,
    ...passthrough,
  }
}

type Context = {
  db: Database
  feedService: FeedService
  appCtx: AppContext
  authorization?: string
}

type Params = GetFeedParams & { viewer: string }

type SkeletonState = {
  params: Params
  feedSkele: SkeletonFeedPost[]
  passthrough: Record<string, unknown> // pass through additional items in feedgen response
  cursor?: string
  timerSkele: ServerTimer
}

type HydrationState = SkeletonState &
  FeedHydrationState & { feedItems: FeedRow[]; timerHydr: ServerTimer }

const skeletonFromFeedGen = async (
  ctx: AppContext,
  db: Database,
  params: GetFeedParams,
  authorization?: string,
): Promise<AlgoResponse> => {
  const { feed } = params
  // Resolve and fetch feed skeleton
  const found = await db.db
    .selectFrom('feed_generator')
    .where('uri', '=', feed)
    .select('feedDid')
    .executeTakeFirst()
  if (!found) {
    throw new InvalidRequestError('could not find feed')
  }
  const feedDid = found.feedDid

  let resolved: DidDocument | null
  try {
    resolved = await ctx.idResolver.did.resolve(feedDid)
  } catch (err) {
    if (err instanceof PoorlyFormattedDidDocumentError) {
      throw new InvalidRequestError(`invalid did document: ${feedDid}`)
    }
    throw err
  }
  if (!resolved) {
    throw new InvalidRequestError(`could not resolve did document: ${feedDid}`)
  }

  const fgEndpoint = getFeedGen(resolved)
  if (!fgEndpoint) {
    throw new InvalidRequestError(
      `invalid feed generator service details in did document: ${feedDid}`,
    )
  }

  const agent = new AtpAgent({ service: fgEndpoint })

  let skeleton: SkeletonOutput
  try {
    // @TODO currently passthrough auth headers from pds
    const headers: Record<string, string> = authorization
      ? { authorization }
      : {}
    const result = await agent.api.app.bsky.feed.getFeedSkeleton(params, {
      headers,
    })
    skeleton = result.data
  } catch (err) {
    if (err instanceof AppBskyFeedGetFeedSkeleton.UnknownFeedError) {
      throw new InvalidRequestError(err.message, 'UnknownFeed')
    }
    if (err instanceof XRPCError) {
      if (err.status === ResponseType.Unknown) {
        throw new UpstreamFailureError('feed unavailable')
      }
      if (err.status === ResponseType.InvalidResponse) {
        throw new UpstreamFailureError(
          'feed provided an invalid response',
          'InvalidFeedResponse',
        )
      }
    }
    throw err
  }

  return {
    ...skeleton,
    feed: skeleton.feed.slice(0, params.limit), // enforce limit
  }
}

const cleanFeedSkeleton = async (
  skeleton: SkeletonFeedPost[],
  ctx: Context,
): Promise<FeedRow[]> => {
  const { feedService } = ctx
  const feedItemUris = skeleton.map(getSkeleFeedItemUri)
  const feedItems = await feedService.getFeedItems(feedItemUris)
  const cleaned: FeedRow[] = []
  for (const skeleItem of skeleton) {
    const feedItem = feedItems[getSkeleFeedItemUri(skeleItem)]
    if (feedItem && feedItem.postUri === skeleItem.post) {
      cleaned.push(feedItem)
    }
  }
  return cleaned
}

const getSkeleFeedItemUri = (item: SkeletonFeedPost) => {
  return typeof item.reason?.repost === 'string'
    ? item.reason.repost
    : item.post
}
