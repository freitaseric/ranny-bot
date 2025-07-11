import { z } from 'zod'

export const envSchema = z.object({
	BOT_TOKEN: z.string({ description: 'Discord Bot Token is required' }).min(1),
	WEBHOOK_LOGS_URL: z.string().url().optional(),
	MONGO_URI: z.string({ description: 'MongoDb URI is required' }).min(1),
	SERVER_PORT: z
		.string()
		.refine(v => !Number.isNaN(Number(v)), 'Invalid server port')
		.optional(),
	DATABASE_URL: z.string().url(),
	DIRECT_URL: z.string().url(),
	OPTIMIZE_API_KEY: z.string(),
})
