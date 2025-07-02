import settings from '../../settings.json' with { type: 'json' }
import { envSchema } from './env.schema.js'

import './global.js'
import { validateEnv } from './env.validate.js'
import { logger } from './logger.js'

export * from './error.js'

const env = validateEnv(envSchema)

export { settings, logger, env }
