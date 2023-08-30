import { InvalidRequestError } from '@atproto/xrpc-server'
import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.getFeedSkeleton({
    auth: ctx.authVerifierAnyAudience,
    handler: async ({ params, auth }) => {
      const { feed } = params
      const viewer = auth.credentials.did
      const localAlgo = ctx.algos[feed]

      if (!localAlgo) {
        throw new InvalidRequestError('Unknown feed', 'UnknownFeed')
      }

      const result = await localAlgo(ctx, params, viewer)

      return {
        encoding: 'application/json',
        body: {
          feed: result.feed, // @TODO should we proactively filter blocks/mutes from the skeleton, or treat this similar to other cusotm feeds?
          cursor: result.cursor,
        },
      }
    },
  })
}
