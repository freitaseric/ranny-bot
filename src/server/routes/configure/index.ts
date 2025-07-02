import { StatusCodes } from 'http-status-codes'
import prisma from '#database'
import { defineRoutes } from '#server'
import { logger } from '#settings'

export default defineRoutes((app, client) => {
	app.get('/', (_, res) => {
		return res.status(StatusCodes.NO_CONTENT)
	})

	app.post('/channel/logs', async (req, res) => {
		const { guildId, channelId } = req.body as {
			guildId: string
			channelId: string
		}

		try {
			if (!prisma.guild.findUnique({ where: { id: guildId } }))
				return res
					.status(StatusCodes.BAD_REQUEST)
					.send({ message: 'Guild not in the database' })

			const guild = await client.guilds.fetch(guildId)
			const channel = await guild.channels.fetch(channelId)
			if (!channel)
				return res
					.status(StatusCodes.BAD_REQUEST)
					.send({ message: 'Invalid channel id' })

			await prisma.guild.update({
				data: { logChannelId: channel.id },
				where: { id: guild.id },
			})

			return res
				.status(StatusCodes.OK)
				.send({ message: 'Log channel set successfully' })
		} catch (error) {
			logger.error(error)
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({ error: 'Failed to set log channel' })
		}
	})

	app.post('/channel/vips-table', async (req, res) => {
		const { guildId, channelId } = req.body as {
			guildId: string
			channelId: string
		}

		try {
			if (!prisma.guild.findUnique({ where: { id: guildId } }))
				return res
					.status(StatusCodes.BAD_REQUEST)
					.send({ message: 'Guild not in the database' })

			const guild = await client.guilds.fetch(guildId)
			const channel = await guild.channels.fetch(channelId)
			if (!channel)
				return res
					.status(StatusCodes.BAD_REQUEST)
					.send({ message: 'Invalid channel id' })

			await prisma.guild.update({
				data: { vipsChannelId: channel.id },
				where: { id: guild.id },
			})

			return res
				.status(StatusCodes.OK)
				.send({ message: 'Vips table channel set successfully' })
		} catch (error) {
			logger.error(error)
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({ error: 'Failed to set log channel' })
		}
	})
})
