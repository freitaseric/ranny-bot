import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'
import { env } from '#settings'

const globalForPrisma = global as unknown as {
	prisma: PrismaClient
}

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient().$extends(withOptimize({ apiKey: env.OPTIMIZE_API_KEY }))

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
