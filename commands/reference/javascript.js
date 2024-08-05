import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { jsTitles, getMDNFile } from 'jsman'
import { getSection, getHeader } from 'jsman/dist/parser/index.js';

const truncateString = (str) => {
    const MAX_LENGTH = 1024;
    return str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH - 3) + '...' : str;
}

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
		console.log(JSON.stringify(interaction.options._hoistedOptions[0].value))
        const file = getMDNFile(interaction.options._hoistedOptions[0].value)
        const params = getSection('Parameters', file);
        const header = getHeader(file);
        // let reply;
        // if (header) {
        //     reply = header.title + params
        // } else {
        //     reply = params
        // }
		// await interaction.reply(reply);
 
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(header.title)
            .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
            .addFields(
                { name: 'Parameters', value: truncateString(params) },
            )
        
            await interaction.reply({ embeds: [exampleEmbed] });
	},
};
