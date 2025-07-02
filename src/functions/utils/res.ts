/** biome-ignore-all lint/performance/noAccumulatingSpread: external developer decision */
import {
	type ComponentData,
	createContainer,
	isAttachment,
	withProperties,
} from '@magicyan/discord'
import { MessageFlags } from 'discord.js'
import { settings } from '#settings'

type UnusedProps =
	| 'content'
	| 'embeds'
	| 'components'
	| 'ephemeral'
	| 'fetchReply'

type ResFunction = <R>(...components: ComponentData[]) => R & {
	with<R>(options: Partial<Omit<R, UnusedProps>>): R
}

type Res = Record<keyof typeof settings.colors, ResFunction>

export const res: Res = Object.entries(settings.colors).reduce(
	(acc, [key, color]) => ({
		...acc,
		[key]: (...components: ComponentData[]) => {
			const container = createContainer(color, components)
			const files = components.filter(isAttachment)
			const defaults = {
				files,
				flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
				components: [container],
			}
			const withFunc = (options: object) => {
				if ('flags' in options && Array.isArray(options.flags)) {
					options.flags = Array.from(
						new Set([MessageFlags.IsComponentsV2, ...options.flags]),
					)
				}
				if ('files' in options && Array.isArray(options.files)) {
					options.files = [...files, ...options.files]
				}
				return { ...defaults, ...options }
			}
			return withProperties(defaults, { with: withFunc })
		},
	}),
	{} as Res,
)
