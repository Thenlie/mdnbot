import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { jsTitles, getMDNFile } from 'mdnman'
import { getSection, getHeader, stripJsxRef, expandLinks } from 'mdnman/dist/parser/index.js';
import { truncateString, createChoicesFromTitles } from '../../utils.js';
import { autocompleteHandler } from '../../autocomplete.js';

const choices = createChoicesFromTitles(jsTitles);

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
        await autocompleteHandler(interaction, choices);
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

        const strippedDoc = expandLinks(stripJsxRef(document));
 
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x3170D6)
            .setTitle(header.title)
            .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
            .setDescription(truncateString(strippedDoc))
        
            await interaction.reply({ embeds: [exampleEmbed] });
	},
};
