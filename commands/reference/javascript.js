import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { jsTitles, getMDNFile } from 'jsman'
import { getSection, getHeader, stripJsxRef } from 'jsman/dist/parser/index.js';

const removeTitle = (doc) => {
    // Find the index of the second newline character
    const newlineIndex = doc.indexOf('\n', doc.indexOf('\n') + 1);
    // If there are fewer than two newlines, return the original string
    if (newlineIndex === -1) return doc;
    // Return the substring starting after the second newline
    return doc.substring(newlineIndex + 1);
}

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
            option.setName('section')
                .setDescription('Which section of the MDN document to return')
                .setRequired(true)
                .setChoices([
                    {
                        name: 'Description',
                        value: 'Description'
                    },
                    {
                        name: 'Parameters',
                        value: 'Parameters'
                    },
                    {
                        name: 'Examples',
                        value: 'Examples'
                    }
                ])
        )
		.addStringOption(option => 
			option.setName('query')
				.setDescription('JavaScript reference to search for')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
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
        const options = interaction.options._hoistedOptions;
        const filepath = options.find(obj => obj.name === 'query').value
        const section = options.find(obj => obj.name === 'section').value

        if (!filepath || !section) {
            console.error(`No filepath or section provided! Filepath: ${filepath}, Section: ${section}`)
            await interaction.reply()
            return;
        }

        const file = getMDNFile(filepath)
        const document = getSection(section, file);
        const header = getHeader(file);

        const strippedDoc = stripJsxRef(document);
 
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x3170D6)
            .setTitle(header.title)
            .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
            .setDescription(truncateString(strippedDoc))
        
            await interaction.reply({ embeds: [exampleEmbed] });
	},
};
