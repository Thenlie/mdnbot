import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { htmlTitles, getMDNFile } from 'mdnman'
import { getSection, getHeader, stripJsxRef, getHtmlDescription, stripHeader, expandLinks, convertEmojiTags } from 'mdnman/dist/parser/index.js';
import { truncateString, createChoicesFromTitles } from '../../utils.js';

const choices = createChoicesFromTitles(htmlTitles);

export default {
	data: new SlashCommandBuilder()
		.setName('html')
		.setDescription('Search the MDN HTML documentation')
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
                        name: 'Attributes',
                        value: 'Attributes'
                    },
                    {
                        name: 'Examples',
                        value: 'Examples'
                    }
                ])
        )
		.addStringOption(option => 
			option.setName('query')
				.setDescription('HTML reference to search for')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const filtered = choices.filter(choice => choice.name.includes(focusedValue));
        // Truncate filtered  array to length of 25 per discord's limit
        const response = filtered.slice(0, 24).map(choice => {
            return { name: choice.name, value: choice.value }
        });
		await interaction.respond(response);
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
        let document;
        if (section === 'Description') {
            document = stripHeader(getHtmlDescription(file));
        } else {
            document = getSection(section, file);
        }
        const header = getHeader(file);

        const strippedDoc = convertEmojiTags(expandLinks(stripJsxRef(document)));
 
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x3170D6)
            .setTitle(header.title)
            .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
            .setDescription(truncateString(strippedDoc))
        
            await interaction.reply({ embeds: [exampleEmbed] });
	},
};