import { sql } from 'kysely'
import { Database } from '../../db'
import { ImageUriBuilder } from '../../image/uri'
import { valuesList } from '../../db/util'
import { ListInfo } from './types'
import { ActorInfoMap } from '../actor'

export class GraphService {
  constructor(public db: Database, public imgUriBuilder: ImageUriBuilder) {}

  static creator(imgUriBuilder: ImageUriBuilder) {
    return (db: Database) => new GraphService(db, imgUriBuilder)
  }

  async muteActor(info: {
    subjectDid: string
    mutedByDid: string
    createdAt?: Date
  }) {
    const { subjectDid, mutedByDid, createdAt = new Date() } = info
    await this.db
      .asPrimary()
      .db.insertInto('mute')
      .values({
        subjectDid,
        mutedByDid,
        createdAt: createdAt.toISOString(),
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  async unmuteActor(info: { subjectDid: string; mutedByDid: string }) {
    const { subjectDid, mutedByDid } = info
    await this.db
      .asPrimary()
      .db.deleteFrom('mute')
      .where('subjectDid', '=', subjectDid)
      .where('mutedByDid', '=', mutedByDid)
      .execute()
  }

  async muteActorList(info: {
    list: string
    mutedByDid: string
    createdAt?: Date
  }) {
    const { list, mutedByDid, createdAt = new Date() } = info
    await this.db
      .asPrimary()
      .db.insertInto('list_mute')
      .values({
        listUri: list,
        mutedByDid,
        createdAt: createdAt.toISOString(),
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  async unmuteActorList(info: { list: string; mutedByDid: string }) {
    const { list, mutedByDid } = info
    await this.db
      .asPrimary()
      .db.deleteFrom('list_mute')
      .where('listUri', '=', list)
      .where('mutedByDid', '=', mutedByDid)
      .execute()
  }

  getListsQb(viewer: string | null) {
    const { ref } = this.db.db.dynamic
    return this.db.db
      .selectFrom('list')
      .innerJoin('actor', 'actor.did', 'list.creator')
      .selectAll('list')
      .selectAll('actor')
      .select('list.sortAt as sortAt')
      .select(
        this.db.db
          .selectFrom('list_mute')
          .where('list_mute.mutedByDid', '=', viewer ?? '')
          .whereRef('list_mute.listUri', '=', ref('list.uri'))
          .select('list_mute.listUri')
          .as('viewerMuted'),
      )
  }

  getListItemsQb() {
    return this.db.db
      .selectFrom('list_item')
      .innerJoin('actor as subject', 'subject.did', 'list_item.subjectDid')
      .selectAll('subject')
      .select(['list_item.cid as cid', 'list_item.sortAt as sortAt'])
  }

  async getBlockAndMuteState(
    pairs: RelationshipPair[],
    bam?: BlockAndMuteState,
  ) {
    pairs = bam ? pairs.filter((pair) => !bam.seen(pair)) : pairs
    const result = bam ?? new BlockAndMuteState()
    if (!pairs.length) return result
    const { ref } = this.db.db.dynamic
    const sourceRef = ref('pair.source')
    const targetRef = ref('pair.target')
    const values = valuesList(pairs.map((p) => sql`${p[0]}, ${p[1]}`))
    const items = await this.db.db
      .selectFrom(values.as(sql`pair (source, target)`))
      .select([
        sql<string>`${sourceRef}`.as('source'),
        sql<string>`${targetRef}`.as('target'),
        this.db.db
          .selectFrom('actor_block')
          .whereRef('creator', '=', sourceRef)
          .whereRef('subjectDid', '=', targetRef)
          .select('uri')
          .as('blocking'),
        this.db.db
          .selectFrom('actor_block')
          .whereRef('creator', '=', targetRef)
          .whereRef('subjectDid', '=', sourceRef)
          .select('uri')
          .as('blockedBy'),
        this.db.db
          .selectFrom('mute')
          .whereRef('mutedByDid', '=', sourceRef)
          .whereRef('subjectDid', '=', targetRef)
          .select(sql<true>`${true}`.as('val'))
          .as('muting'),
        this.db.db
          .selectFrom('list_item')
          .innerJoin('list_mute', 'list_mute.listUri', 'list_item.listUri')
          .whereRef('list_mute.mutedByDid', '=', sourceRef)
          .whereRef('list_item.subjectDid', '=', targetRef)
          .select('list_item.listUri')
          .limit(1)
          .as('mutingViaList'),
      ])
      .selectAll()
      .execute()
    items.forEach((item) => result.add(item))
    return result
  }

  async getBlockState(pairs: RelationshipPair[], bam?: BlockAndMuteState) {
    pairs = bam ? pairs.filter((pair) => !bam.seen(pair)) : pairs
    const result = bam ?? new BlockAndMuteState()
    if (!pairs.length) return result
    const { ref } = this.db.db.dynamic
    const sourceRef = ref('pair.source')
    const targetRef = ref('pair.target')
    const values = valuesList(pairs.map((p) => sql`${p[0]}, ${p[1]}`))
    const items = await this.db.db
      .selectFrom(values.as(sql`pair (source, target)`))
      .select([
        sql<string>`${sourceRef}`.as('source'),
        sql<string>`${targetRef}`.as('target'),
        this.db.db
          .selectFrom('actor_block')
          .whereRef('creator', '=', sourceRef)
          .whereRef('subjectDid', '=', targetRef)
          .select('uri')
          .as('blocking'),
        this.db.db
          .selectFrom('actor_block')
          .whereRef('creator', '=', targetRef)
          .whereRef('subjectDid', '=', sourceRef)
          .select('uri')
          .as('blockedBy'),
      ])
      .selectAll()
      .execute()
    items.forEach((item) => result.add(item))
    return result
  }

  async getListViews(listUris: string[], requester: string | null) {
    if (listUris.length < 1) return {}
    const lists = await this.getListsQb(requester)
      .where('list.uri', 'in', listUris)
      .execute()
    return lists.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.uri]: cur,
      }),
      {},
    )
  }

  formatListView(list: ListInfo, profiles: ActorInfoMap) {
    return {
      uri: list.uri,
      cid: list.cid,
      creator: profiles[list.creator],
      name: list.name,
      purpose: list.purpose,
      description: list.description ?? undefined,
      descriptionFacets: list.descriptionFacets
        ? JSON.parse(list.descriptionFacets)
        : undefined,
      avatar: list.avatarCid
        ? this.imgUriBuilder.getPresetUri(
            'avatar',
            list.creator,
            list.avatarCid,
          )
        : undefined,
      indexedAt: list.sortAt,
      viewer: {
        muted: !!list.viewerMuted,
      },
    }
  }

  formatListViewBasic(list: ListInfo) {
    return {
      uri: list.uri,
      cid: list.cid,
      name: list.name,
      purpose: list.purpose,
      avatar: list.avatarCid
        ? this.imgUriBuilder.getPresetUri(
            'avatar',
            list.creator,
            list.avatarCid,
          )
        : undefined,
      indexedAt: list.indexedAt,
      viewer: {
        muted: !!list.viewerMuted,
      },
    }
  }
}

export type RelationshipPair = [didA: string, didB: string]

export class BlockAndMuteState {
  seenIdx = new Map<string, Set<string>>()
  blockIdx = new Map<string, Map<string, string>>()
  muteIdx = new Map<string, Set<string>>()
  muteListIdx = new Map<string, Map<string, string>>()
  constructor(items: BlockAndMuteInfo[] = []) {
    items.forEach((item) => this.add(item))
  }
  add(item: BlockAndMuteInfo) {
    if (item.blocking) {
      const map = this.blockIdx.get(item.source) ?? new Map()
      map.set(item.target, item.blocking)
      if (!this.blockIdx.has(item.source)) {
        this.blockIdx.set(item.source, map)
      }
    }
    if (item.blockedBy) {
      const map = this.blockIdx.get(item.target) ?? new Map()
      map.set(item.source, item.blockedBy)
      if (!this.blockIdx.has(item.target)) {
        this.blockIdx.set(item.target, map)
      }
    }
    if (item.muting) {
      const set = this.muteIdx.get(item.source) ?? new Set()
      set.add(item.target)
      if (!this.muteIdx.has(item.source)) {
        this.muteIdx.set(item.source, set)
      }
    }
    if (item.mutingViaList) {
      const map = this.muteListIdx.get(item.source) ?? new Map()
      map.set(item.target, item.mutingViaList)
      if (!this.muteListIdx.has(item.source)) {
        this.muteListIdx.set(item.source, map)
      }
    }
    const set = this.seenIdx.get(item.source) ?? new Set()
    set.add(item.target)
    if (!this.seenIdx.has(item.source)) {
      this.seenIdx.set(item.source, set)
    }
  }
  block(pair: RelationshipPair): boolean {
    return !!this.blocking(pair) || !!this.blockedBy(pair)
  }
  blocking(pair: RelationshipPair): string | null {
    return this.blockIdx.get(pair[0])?.get(pair[1]) ?? null
  }
  blockedBy(pair: RelationshipPair): string | null {
    return this.blocking([pair[1], pair[0]])
  }
  mute(pair: RelationshipPair): boolean {
    return !!this.muteIdx.get(pair[0])?.has(pair[1]) || !!this.muteList(pair)
  }
  muteList(pair: RelationshipPair): string | null {
    return this.muteListIdx.get(pair[0])?.get(pair[1]) ?? null
  }
  seen(pair: RelationshipPair) {
    return !!this.seenIdx.get(pair[0])?.has(pair[1])
  }
}

type BlockAndMuteInfo = {
  source: string
  target: string
  blocking?: string | null
  blockedBy?: string | null
  muting?: true | null
  mutingViaList?: string | null
}
