import {
	brBuilder,
	createContainer,
	createThumbArea,
	limitText,
	Separator,
} from '@magicyan/discord'
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	codeBlock,
} from 'discord.js'
import { createCommand } from '#base'
import { createErrorEmbed, ErrorReason, isOwner, timestamp } from '#functions'
import { settings } from '#settings'

createCommand({
	name: 'eval',
	description: 'Evaluate any code from a discord command',
	descriptionLocalizations: {
		'pt-BR': 'Execute qualquer código a partir de um comando do discord',
	},
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'code',
			description: 'The code to evaluate',
			descriptionLocalizations: {
				'pt-BR': 'O código para executar',
			},
			type: ApplicationCommandOptionType.String,
			required,
		},
	],
	async run(interaction) {
		if (!isOwner(interaction)) {
			await interaction.reply({
				components: [createErrorEmbed(ErrorReason.OWNER_ONLY)],
				flags: [...flags, 'Ephemeral'],
			})
			return
		}

		const { options } = interaction
		const code = options.getString('code', true).replace(/```[\w-]*\n?/g, '')

		try {
			// biome-ignore lint/security/noGlobalEval: is the main command logic
			const result = eval(code)

			const container = createContainer(
				settings.colors.nitro,
				createThumbArea(
					brBuilder(
						`Executado por ${interaction.user.displayName}`,
						`-# Em ${timestamp('F')}`,
					),
					interaction.user.displayAvatarURL(),
				),
				brBuilder('### 📥 | Entrada:', codeBlock('js', code)),
				Separator.Default,
				brBuilder(
					'### 📤 | Saída:',
					codeBlock(
						'js',
						typeof result === 'object'
							? limitText(JSON.stringify(result, null, 2), 4997, '...')
							: limitText(result, 4997, '...'),
					),
				),
			)

			await interaction.reply({
				components: [container],
				flags,
			})
		} catch (error) {
			const container = createContainer(
				settings.colors.brilliance,
				createThumbArea(
					brBuilder(
						`Executado por ${interaction.user.displayName}`,
						`-# Em ${timestamp('F')}`,
					),
					interaction.user.displayAvatarURL(),
				),
				'## ❌ | A execução retornou um erro!',
				brBuilder('### 📥 | Entrada:', codeBlock('js', code)),
				Separator.Default,
				brBuilder('### 📤 | Saída:', codeBlock('js', `${error}`)),
			)

			await interaction.reply({
				components: [container],
				flags,
			})
		}
	},
})

createCommand({
	name: 'Evaluate Code',
	nameLocalizations: {
		'pt-BR': 'Executar Código',
	},
	type: ApplicationCommandType.Message,
	async run(interaction) {
		if (!isOwner(interaction)) {
			await interaction.reply({
				components: [createErrorEmbed(ErrorReason.OWNER_ONLY)],
				flags: [...flags, 'Ephemeral'],
			})
			return
		}

		const { targetMessage: message } = interaction
		const code = message.content.replace(/```[\w-]*\n?/g, '')

		try {
			// biome-ignore lint/security/noGlobalEval: is the main command logic
			const result = eval(code)

			const container = createContainer(
				settings.colors.nitro,
				createThumbArea(
					brBuilder(
						`Executado por ${interaction.user.displayName}`,
						`-# Em ${timestamp('F')}`,
					),
					interaction.user.displayAvatarURL(),
				),
				brBuilder('### 📥 | Entrada:', codeBlock('js', code)),
				Separator.Default,
				brBuilder(
					'### 📤 | Saída:',
					codeBlock(
						'js',
						typeof result === 'object'
							? limitText(JSON.stringify(result, null, 2), 4997, '...')
							: limitText(result, 4997, '...'),
					),
				),
			)

			await interaction.reply({
				components: [container],
				flags,
			})
		} catch (error) {
			const container = createContainer(
				settings.colors.brilliance,
				createThumbArea(
					brBuilder(
						`Executado por ${interaction.user.displayName}`,
						`-# Em ${timestamp('F')}`,
					),
					interaction.user.displayAvatarURL(),
				),
				'## ❌ | A execução retornou um erro!',
				brBuilder('### 📥 | Entrada:', codeBlock('js', code)),
				Separator.Default,
				brBuilder('### 📤 | Saída:', codeBlock('js', `${error}`)),
			)

			await interaction.reply({
				components: [container],
				flags,
			})
		}
	},
})
