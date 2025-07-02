import { createModalFields } from '@magicyan/discord'
import { TextInputStyle } from 'discord.js'
import { createResponder, ResponderType } from '#base'
import { res } from '#functions'

createResponder({
	customId: 'vips/:authorId/:action/:vipId',
	types: [ResponderType.Button, ResponderType.ModalComponent],
	cache: 'cached',
	async run(interaction, { authorId, action, vipId: _ }) {
		if (authorId !== interaction.user.id) {
			await interaction.reply(res.danger(`Você não é <@${authorId}>!`))
			return
		}

		switch (action) {
			case 'add': {
				if (!interaction.isButton()) return
				await interaction.showModal({
					customId: `/vips/${interaction.user.id}/create`,
					title: 'Adicionar Tier Vip',
					components: createModalFields({
						name: {
							label: 'Nome do Tier',
							style: TextInputStyle.Short,
							maxLength: 50,
							required: true,
						},
						description: {
							label: 'Descrição do Tier',
							style: TextInputStyle.Paragraph,
							maxLength: 4000,
							required: true,
						},
					}),
				})

				return
			}
			case 'edit': {
				return
			}
			case 'create': {
				return
			}
		}
	},
})
