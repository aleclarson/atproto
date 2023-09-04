import pinoHttp from 'pino-http'
import { subsystemLogger, Logger } from '@atproto/common'

export const dbLogger: Logger = subsystemLogger('bsky:db')
export const subLogger: Logger = subsystemLogger('bsky:sub')
export const labelerLogger: Logger = subsystemLogger('bsky:labeler')
export const httpLogger: Logger = subsystemLogger('bsky')

export const loggerMiddleware = pinoHttp({
  logger: httpLogger,
})
