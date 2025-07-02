import type { CommandInteraction } from 'discord.js'
import { settings } from '#settings'

export function isOwner(interaction: CommandInteraction) {
	return interaction.user.id === settings.bot.ownerId
}

export enum ErrorReason {
	OWNER_ONLY = 'Funcionalidade exclusiva para desenvolvedores!',
}

export function timestamp(
	format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R',
	date = Date.now(),
) {
	const ms = Math.floor(date / 1000)

	return `<t:${ms}${format ? `:${format}>` : '>'}`
}
