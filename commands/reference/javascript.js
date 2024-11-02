import { SlashCommandBuilder } from 'discord.js';
import { javascriptTitles } from 'mdnman';
import { queryAutocompleteHandler, sectionAutocompleteHandler } from '../../autocomplete.js';
import { referenceCommandExecutor } from '../../utils.js';

// Discord limits the value to 100 characters so we remove 'lib/javascript'
// and '/index.md' from the path to ensure it fits this limit
const choices = javascriptTitles.map((title) => {
    return {
        name: title.title,
        value: title.path.substring(15, title.path.length - 9),
    };
});

export default {
    data: new SlashCommandBuilder()
        .setName('javascript')
        .setDescription('Search the MDN JavaScript documentation')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('JavaScript reference to search for')
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
