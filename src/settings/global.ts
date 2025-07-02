import { join } from 'node:path'

declare global {
	const animated: true
	const withResponse: true
	const flags: ['IsComponentsV2']
	const required: true
	const inline: true
	const disabled: true
	const __rootname: string
	const autocomplete: true
	function rootTo(...path: string[]): string
}

Object.assign(
	globalThis,
	Object.freeze({
		animated: true,
		withResponse: true,
		flags: ['IsComponentsV2'],
		required: true,
		inline: true,
		disabled: true,
		autocomplete: true,
		__rootname: process.cwd(),
		rootTo(...path: string[]) {
			return join(process.cwd(), ...path)
		},
	}),
)
