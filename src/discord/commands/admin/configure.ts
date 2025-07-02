import {
	brBuilder,
	createContainer,
	createLinkButton,
	createSection,
	createThumbArea,
	Separator,
} from '@magicyan/discord'
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	bold,
	PermissionFlagsBits,
	type TextChannel,
} from 'discord.js'
import { createCommand } from '#base'
import prisma from '#database'
import { res, timestamp } from '#functions'
import { settings } from '#settings'

type Subcommands = 'channels' | 'vips'

createCommand({
	name: 'configure',
	nameLocalizations: {
		'pt-BR': 'configurar',
	},
	description: "Configure the Ranny's systems",
	descriptionLocalizations: {
		'pt-BR': 'Configure os sistemas da Ranny',
	},
	options: [
		{
			name: 'channels',
			nameLocalizations: {
				'pt-BR': 'canais',
			},
			description: "Configure the Ranny's channels",
			descriptionLocalizations: {
				'pt-BR': 'Configure os canais da Ranny',
			},
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'vips',
			description: "Configure the Ranny's vips tiers",
			descriptionLocalizations: {
				'pt-BR': 'Configure os tiers de vip da Ranny',
			},
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	type: ApplicationCommandType.ChatInput,
	async run(interaction) {
		if (!interaction.inCachedGuild) return

		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			await interaction.reply(
				res.danger(
					'### Este comando é exclusivo para membros com a permissão `Gerenciar Servidor`!',
				),
			)
			return
		}

		const { options } = interaction

		const subcmd = options.getSubcommand(true) as Subcommands
		const guild =
			(await prisma.guild.findUnique({
				where: { id: interaction.guildId },
				include: { vips: true },
			})) ??
			(await prisma.guild.create({
				data: { id: interaction.guildId },
				include: { vips: true },
			}))

		switch (subcmd) {
			case 'channels': {
				const channelLogs = guild.logChannelId
					? ((await interaction.guild.channels.fetch(
							guild.logChannelId,
						)) as TextChannel)
					: undefined
				const channelVips = guild.vipsChannelId
					? ((await interaction.guild.channels.fetch(
							guild.vipsChannelId,
						)) as TextChannel)
					: undefined

				const container = createContainer(
					settings.colors.nitro,
					createThumbArea(
						`## Configurações da Ranny para ${interaction.guild}`,
						interaction.guild.iconURL(),
					),
					createSection(
						brBuilder(
							'### 📮 | Canal de Logs',
							channelLogs
								? `O canal ${channelLogs} foi definido como canal de logs. Irei postar qualquer atualização ou atividade que ocorrer com relação ao sistema de vips nele.`
								: 'Este será o canal utilizado para postar qualquer atualização ou atividade que ocorrer com relação ao sistema de vips.',
						),
						channelLogs
							? createLinkButton({
									label: 'Ir para',
									emoji: '↗️',
									url: channelLogs.url,
								})
							: new ButtonBuilder({
									customId: `channel/${interaction.user.id}/logs/change`,
									label: 'Definir canal',
									emoji: '➕',
									style: ButtonStyle.Success,
								}),
					),
					createSection(
						brBuilder(
							'### 📖 | Canal de Tabela de Vips',
							channelVips
								? `O canal ${channelVips} foi definido como canal de tabela de bips. Irei postar e atualizar a tabela de vips do servidor informando os tiers disponíveis.`
								: 'Este será o canal utilizado para postar a tabela de vips do servidor informando os tiers disponíveis.',
						),
						channelVips
							? createLinkButton({
									label: 'Ir para',
									emoji: '↗️',
									url: channelVips.url,
								})
							: new ButtonBuilder({
									customId: `channel/${interaction.user.id}/vipsTable/change`,
									label: 'Definir canal',
									emoji: '➕',
									style: ButtonStyle.Success,
								}),
					),
					Separator.Large,
					createThumbArea(
						brBuilder(
							bold(`Executado por ${interaction.user}`),
							`-# Em ${timestamp('F')}`,
						),
						interaction.user.displayAvatarURL(),
					),
				)

				await interaction.reply({
					flags,
					components: [container],
				})

				return
			}

			case 'vips': {
				const container = createContainer(
					settings.colors.nitro,
					createThumbArea(
						`## Configurações da Ranny para ${interaction.guild}`,
						interaction.guild.iconURL(),
					),
					guild.vips.length !== 0
						? guild.vips.map(v =>
								createSection(
									brBuilder(
										`### ⚪ ${v.name}`,
										`**Cargo:** <@&${v.roleId}>`,
										`**Descrição:** ${v.description}`,
									),
									new ButtonBuilder({
										customId: `/vips/${interaction.user.id}/edit/${v.id}`,
										emoji: '📝',
										label: 'Editar Tier',
										style: ButtonStyle.Primary,
									}),
								),
							)
						: createSection(
								'### Não há vips configurados para este servidor.',
								new ButtonBuilder({
									customId: `/vips/${interaction.user.id}/add`,
									emoji: '➕',
									label: 'Adicionar Tier',
									style: ButtonStyle.Secondary,
								}),
							),
					Separator.Large,
					createThumbArea(
						brBuilder(
							bold(`Executado por ${interaction.user}`),
							`-# Em ${timestamp('F')}`,
						),
						interaction.user.displayAvatarURL(),
					),
				)

				await interaction.reply({
					flags,
					components: [container],
				})

				return
			}
		}
	},
})
