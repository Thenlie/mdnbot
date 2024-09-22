import { SlashCommandBuilder } from 'discord.js';
import { htmlTitles, createChoicesFromTitles } from 'mdnman';
import { queryAutocompleteHandler, sectionAutocompleteHandler } from '../../autocomplete.js';
import { referenceCommandExecutor } from './utils.js';

const choices = createChoicesFromTitles(htmlTitles);

export default {
    data: new SlashCommandBuilder()
        .setName('html')
        .setDescription('Search the MDN HTML documentation')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('HTML reference to search for')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption((option) =>
            option
                .setName('section')
                .setDescription('Which section of the MDN document to return')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {
        const focusedOption = interaction.options._hoistedOptions.find(
            (obj) => obj.focused === true
        );
        if (focusedOption.name === 'query') {
            await queryAutocompleteHandler(interaction, choices);
        } else if (focusedOption.name === 'section') {
            await sectionAutocompleteHandler(interaction);
        }
    },
    async execute(interaction) {
        await referenceCommandExecutor(interaction);
    },
};
