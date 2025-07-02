import { ActivityType } from 'discord.js'
import { createEvent } from '#base'

createEvent({
	name: 'Change bot presence',
	event: 'ready',
	async run(client) {
		client.user.setPresence({
			status: 'idle',
			activities: [
				{
					name: 'Em desenvolvimento...',
					type: ActivityType.Custom,
				},
			],
		})
	},
})
