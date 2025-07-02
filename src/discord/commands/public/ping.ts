import { brBuilder, createContainer } from '@magicyan/discord'
import { ApplicationCommandType } from 'discord.js'
import { createCommand } from '#base'
import { settings } from '#settings'
import prisma from '#database'

createCommand({
	name: 'ping',
	description: "Replies with bot's latency 🏓",
	descriptionLocalizations: {
		'pt-BR': 'Responde com a latência do bot 🏓',
	},
	type: ApplicationCommandType.ChatInput,
	async run(interaction) {
		const start = Date.now()
		await prisma.guild.count()
		const dbLatency = Date.now() - start

		const container = createContainer(
			settings.colors.nitro,
			brBuilder(
				`🤖 | Minha latência é de \`${interaction.client.ws.ping}ms\``,
				`🗄️ | A latência do banco de dados é de \`${dbLatency}ms\``,
			),
		)
		await interaction.reply({
			flags,
			components: [container],
		})
	},
})
