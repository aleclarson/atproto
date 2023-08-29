import { Selectable, sql } from 'kysely'
import { Database } from '../../db'
import { ImageUriBuilder } from '../../image/uri'
import { ProfileView } from '../../lexicon/types/app/bsky/actor/defs'
import { List } from '../../db/tables/list'
import { valuesList } from '../../db/util'

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

  async getBlocks(
    requester: string,
    subjectHandleOrDid: string,
  ): Promise<{ blocking: boolean; blockedBy: boolean }> {
    let subjectDid
    if (subjectHandleOrDid.startsWith('did:')) {
      subjectDid = subjectHandleOrDid
    } else {
      const res = await this.db.db
        .selectFrom('actor')
        .where('handle', '=', subjectHandleOrDid)
        .select('did')
        .executeTakeFirst()
      if (!res) {
        return { blocking: false, blockedBy: false }
      }
      subjectDid = res.did
    }

    const blockSet = await this.getBlockSet([[requester, subjectDid]], false)

    return {
      blocking: blockSet.has([requester, subjectDid]),
      blockedBy: blockSet.has([subjectDid, requester]),
    }
  }

  async getBlockSet(relationships: RelationshipPair[], bidirectional = true) {
    const { ref } = this.db.db.dynamic
    const blockSet = new RelationshipSet()
    if (!relationships.length) return blockSet
    const relationshipSet = new RelationshipSet()
    relationships.forEach((pair) => relationshipSet.add(pair, true))
    // compute actual block set from all actor relationships
    const blockRows = await this.db.db
      .selectFrom('actor_block')
      .select(['creator', 'subjectDid']) // index-only columns
      .where(
        sql`(${ref('creator')}, ${ref('subjectDid')})`,
        'in',
        valuesList(
          relationshipSet.listAllPairs().map(([a, b]) => sql`${a}, ${b}`),
        ),
      )
      .execute()
    blockRows.forEach((r) =>
      blockSet.add([r.creator, r.subjectDid], bidirectional),
    )
    return blockSet
  }

  async getMuteSet(relationships: RelationshipPair[]) {
    const { ref } = this.db.db.dynamic
    const muteSet = new RelationshipSet()
    if (!relationships.length) return muteSet
    const relationshipSet = new RelationshipSet()
    relationships.forEach((pair) => relationshipSet.add(pair))
    // compute actual mute set from all actor relationships
    const muteRows = await this.db.db
      .selectFrom('mute')
      .select(['mutedByDid', 'subjectDid'])
      .where(
        sql`(${ref('mutedByDid')}, ${ref('subjectDid')})`,
        'in',
        valuesList(
          relationshipSet.listAllPairs().map(([a, b]) => sql`${a}, ${b}`),
        ),
      )
      .unionAll(
        this.db.db
          .selectFrom('list_item')
          .innerJoin('list_mute', 'list_mute.listUri', 'list_item.listUri')
          .where(
            sql`(${ref('list_mute.mutedByDid')}, ${ref(
              'list_item.subjectDid',
            )})`,
            'in',
            valuesList(
              relationshipSet.listAllPairs().map(([a, b]) => sql`${a}, ${b}`),
            ),
          )
          .select(['list_mute.mutedByDid', 'list_item.subjectDid']),
      )
      .execute()
    muteRows.forEach((r) => muteSet.add([r.mutedByDid, r.subjectDid]))
    return muteSet
  }

  async filterBlocksAndMutes<T>(
    items: T[],
    opts: {
      getBlockPairs?: (item: T) => RelationshipPair[] | undefined
      getMutePairs?: (item: T) => RelationshipPair[] | undefined
    },
  ) {
    const blockPairsPerItem = items.map(
      (item) => opts.getBlockPairs?.(item) ?? [],
    )
    const mutePairsPerItem = items.map(
      (item) => opts.getMutePairs?.(item) ?? [],
    )
    const [blockSet, muteSet] = await Promise.all([
      this.getBlockSet(blockPairsPerItem.flat()),
      this.getMuteSet(mutePairsPerItem.flat()),
    ])
    return items.filter((_, i) => {
      const blockPairs = blockPairsPerItem[i]
      const mutePairs = mutePairsPerItem[i]
      return (
        blockPairs.every((pair) => !blockSet.has(pair)) &&
        mutePairs.every((pair) => !muteSet.has(pair))
      )
    })
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

  formatListView(list: ListInfo, profiles: Record<string, ProfileView>) {
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

type ListInfo = Selectable<List> & {
  viewerMuted: string | null
}

export type RelationshipPair = [didA: string, didB: string]

export class RelationshipSet {
  index = new Map<string, Set<string>>()
  add([didA, didB]: RelationshipPair, bididrectional = false) {
    const didAIdx = this.index.get(didA) ?? new Set()
    if (!this.index.has(didA)) this.index.set(didA, didAIdx)
    didAIdx.add(didB)
    if (bididrectional) {
      const didBIdx = this.index.get(didB) ?? new Set()
      if (!this.index.has(didB)) this.index.set(didB, didBIdx)
      didBIdx.add(didA)
    }
  }
  has([didA, didB]: RelationshipPair) {
    return !!this.index.get(didA)?.has(didB)
  }
  listAllPairs() {
    const pairs: RelationshipPair[] = []
    for (const [didA, didBIdx] of this.index.entries()) {
      for (const didB of didBIdx) {
        pairs.push([didA, didB])
      }
    }
    return pairs
  }
  empty() {
    return this.index.size === 0
  }
}
