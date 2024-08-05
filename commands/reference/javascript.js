import { SlashCommandBuilder } from 'discord.js';
import { jsTitles } from 'jsman'

const createChoicesFromTitle = () => {
	return jsTitles.map(title => {
		return {
			name: title.title,
			value: title.file
		}
	})
};

const choices = createChoicesFromTitle();

export default {
	data: new SlashCommandBuilder()
		.setName('javascript')
		.setDescription('Search the MDN JavaScript documentation')
		.addStringOption(option => 
			option.setName('query')
				.setDescription('JavaScript reference to search for')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		console.log(focusedValue)
		let count = 0;
		const filtered = choices.filter(choice => choice.name.includes(focusedValue));
		await interaction.respond(
			filtered.map(choice => {
				if (count >= 20) return;
				count++;
				return { name: choice.name, value: choice.value }
			}),
		);
	},
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		console.log(JSON.stringify(interaction.options))
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
		// await interaction.reply(response)
	},
};
