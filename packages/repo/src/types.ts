import { z } from 'zod'
import { schema as common, def as commonDef } from '@atproto/common'
import { CID } from 'multiformats'
import BlockMap from './block-map'
import { RepoRecord } from '@atproto/lexicon'
import CidSet from './cid-set'

// Repo nodes
// ---------------

const unsignedCommit = z.object({
  did: z.string(),
  version: z.literal(3),
  data: common.cid,
  rev: z.string(),
  // `prev` added for backwards compatibility with v2, no requirement of keeping around history
  prev: common.cid.nullable().optional(),
})
export type UnsignedCommit = z.infer<typeof unsignedCommit> & { sig?: never }

const commit = z.object({
  did: z.string(),
  version: z.literal(3),
  data: common.cid,
  rev: z.string(),
  prev: common.cid.nullable().optional(),
  sig: common.bytes,
})
export type Commit = z.infer<typeof commit>

const legacyV2Commit = z.object({
  did: z.string(),
  version: z.literal(2),
  data: common.cid,
  rev: z.string().optional(),
  prev: common.cid.nullable(),
  sig: common.bytes,
})
export type LegacyV2Commit = z.infer<typeof legacyV2Commit>

const versionedCommit = z.discriminatedUnion('version', [
  commit,
  legacyV2Commit,
])
export type VersionedCommit = z.infer<typeof versionedCommit>

export const schema = {
  ...common,
  commit,
  legacyV2Commit,
  versionedCommit,
}

type Def = typeof import('@atproto/common').def & typeof repoDef

const repoDef = {
  commit: {
    name: 'commit',
    schema: schema.commit,
  },
  versionedCommit: {
    name: 'versioned_commit',
    schema: schema.versionedCommit,
  },
}

export const def: Def = {
  ...commonDef,
  ...repoDef,
}

// Repo Operations
// ---------------

export enum WriteOpAction {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type RecordCreateOp = {
  action: WriteOpAction.Create
  collection: string
  rkey: string
  record: RepoRecord
}

export type RecordUpdateOp = {
  action: WriteOpAction.Update
  collection: string
  rkey: string
  record: RepoRecord
}

export type RecordDeleteOp = {
  action: WriteOpAction.Delete
  collection: string
  rkey: string
}

export type RecordWriteOp = RecordCreateOp | RecordUpdateOp | RecordDeleteOp

export type RecordCreateDescript = RecordCreateOp & {
  cid: CID
}

export type RecordUpdateDescript = RecordUpdateOp & {
  prev: CID
  cid: CID
}

export type RecordDeleteDescript = RecordDeleteOp & {
  cid: CID
}

export type RecordWriteDescript =
  | RecordCreateDescript
  | RecordUpdateDescript
  | RecordDeleteDescript

export type WriteLog = RecordWriteDescript[][]

// Updates/Commits
// ---------------

export type CommitData = {
  cid: CID
  rev: string
  since: string | null
  prev: CID | null
  newBlocks: BlockMap
  removedCids: CidSet
}

export type RepoUpdate = CommitData & {
  ops: RecordWriteOp[]
}

export type CollectionContents = Record<string, RepoRecord>
export type RepoContents = Record<string, CollectionContents>

export type RepoRecordWithCid = { cid: CID; value: RepoRecord }
export type CollectionContentsWithCids = Record<string, RepoRecordWithCid>
export type RepoContentsWithCids = Record<string, CollectionContentsWithCids>

export type DatastoreContents = Record<string, CID>

export type RecordPath = {
  collection: string
  rkey: string
}

export type RecordClaim = {
  collection: string
  rkey: string
  record: RepoRecord | null
}

// Sync
// ---------------

export type VerifiedDiff = {
  writes: RecordWriteDescript[]
  commit: CommitData
}

export type VerifiedRepo = {
  creates: RecordCreateDescript[]
  commit: CommitData
}
