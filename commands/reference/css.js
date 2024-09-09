import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import {
    cssTitles,
    getMDNFile,
    getSection,
    getHeader,
    stripJsxRef,
    getHtmlDescription,
    stripHeader,
    expandLinks,
    truncateString,
    createChoicesFromTitles,
    removeEmptyLines,
    removeEmptySections,
    convertEmojiTags,
} from 'mdnman';
import { autocompleteHandler } from '../../autocomplete';

const choices = createChoicesFromTitles(cssTitles);

export default {
    data: new SlashCommandBuilder()
        .setName('css')
        .setDescription('Search the MDN CSS documentation')
        .addStringOption((option) =>
            option
                .setName('section')
                .setDescription('Which section of the MDN document to return')
                .setRequired(true)
                .setChoices([
                    {
                        name: 'Description',
                        value: 'Description',
                    },
                    {
                        name: 'Syntax',
                        value: 'Syntax',
                    },
                    {
                        name: 'Values',
                        value: 'Values',
                    },
                ])
        )
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('CSS reference to search for')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {
        await autocompleteHandler(interaction, choices);
    },
    async execute(interaction) {
        const options = interaction.options._hoistedOptions;
        const filepath = options.find((obj) => obj.name === 'query').value;
        const section = options.find((obj) => obj.name === 'section').value;

        if (!filepath || !section) {
            console.error(
                `No filepath or section provided! Filepath: ${filepath}, Section: ${section}`
            );
            await interaction.reply();
            return;
        }

        const file = getMDNFile(filepath);
        let document;
        if (section === 'Description') {
            document = stripHeader(getHtmlDescription(file));
        } else {
            document = getSection(file, section);
        }
        const header = getHeader(file);

        const strippedDoc = removeEmptyLines(
            removeEmptySections(convertEmojiTags(expandLinks(stripJsxRef(document))))
        );

        const embed = new EmbedBuilder()
            .setColor(0x3170d6)
            .setTitle(header.title)
            .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
            .setDescription(truncateString(strippedDoc, 1024));

        await interaction.reply({ embeds: [embed] });
    },
};
