import {
	ChannelSelectMenuBuilder,
	ChannelType,
	type TextChannel,
} from 'discord.js'
import { createResponder, ResponderType } from '#base'
import prisma from '#database'
import { res } from '#functions'

createResponder({
	customId: 'channel/:authorId/:type/:action',
	types: [ResponderType.Button, ResponderType.ChannelSelect],
	cache: 'cached',
	async run(interaction, { authorId, type, action }) {
		if (authorId !== interaction.user.id) {
			await interaction.reply(res.danger(`Você não é <@${authorId}>!`))
			return
		}

		switch (type) {
			case 'logs': {
				switch (action) {
					case 'change': {
						await interaction.reply(
							res.nitro(
								'Escolha um canal usando o menu a seguir!',
								new ChannelSelectMenuBuilder({
									customId: `channel/${interaction.user.id}/logs/set`,
									placeholder: 'Clique para selecionar...',
									maxValues: 1,
									channelTypes: [ChannelType.GuildText],
								}),
							),
						)
						return
					}
					case 'set': {
						if (!interaction.isChannelSelectMenu()) return
						const channel = (await interaction.guild.channels.fetch(
							interaction.values[0],
						)) as TextChannel

						await prisma.guild.update({
							data: { logChannelId: channel.id },
							where: { id: interaction.guildId },
						})

						await interaction.reply(
							res.success(`O canal ${channel} foi definido como logs!`),
						)
						return
					}
					default:
						await interaction.reply(
							res.danger(
								'### Algo deu errado!',
								`Ação indisponível para a interação ${interaction.customId}`,
							),
						)
						break
				}
				return
			}
			case 'vipsTable': {
				switch (action) {
					case 'change': {
						await interaction.reply(
							res.nitro(
								'Escolha um canal usando o menu a seguir!',
								new ChannelSelectMenuBuilder({
									customId: `channel/${interaction.user.id}/vipsTable/set`,
									placeholder: 'Clique para selecionar...',
									maxValues: 1,
									channelTypes: [ChannelType.GuildText],
								}),
							),
						)
						return
					}
					case 'set': {
						if (!interaction.isChannelSelectMenu()) return
						const channel = (await interaction.guild.channels.fetch(
							interaction.values[0],
						)) as TextChannel

						await prisma.guild.update({
							data: { logChannelId: channel.id },
							where: { id: interaction.guildId },
						})

						await interaction.reply(
							res.success(
								`O canal ${channel} foi definido como tabela de vips!`,
							),
						)
						return
					}
					default:
						await interaction.reply(
							res.danger(
								'### Algo deu errado!',
								`Ação indisponível para a interação ${interaction.customId}`,
							),
						)
						break
				}
				return
			}
		}
	},
})
