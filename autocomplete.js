import {
    getAllSections,
    getMDNFile,
    removeEmptySections,
    getPathFromTitle,
    stripJsxRef,
} from 'mdnman';
import { Logger } from './logger.js';
import { hashString } from './utils.js';

export const queryAutocompleteHandler = async (interaction, choices) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const focusedValues = focusedValue.split(/\.| |-/);
    const filtered = choices.filter((choice) =>
        focusedValues.every((value) => choice.name.toLowerCase().includes(value))
    );
    // Truncate displayed name to 100 characters per Discord's limit
    // Truncate response to length of 25 per Discord's limit
    const response = filtered.slice(0, 25).map((choice, i) => {
        const sliceVal = 97 - String(i).length; // 97 accounts for the '. '
        return { name: i + 1 + '. ' + choice.name.slice(0, sliceVal), value: choice.value };
    });
    await interaction.respond(response);
};

const SECTIONS_TO_REMOVE = ['See also', 'Browser compatibility', 'Specifications'];

export const sectionAutocompleteHandler = async (interaction) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const options = interaction.options._hoistedOptions;
    let query = options.find((obj) => obj.name === 'query').value;
    const filepath =
        interaction.commandName === 'javascript' ? 'lib/javascript/' + query + '/index.md' : query;
    if (!filepath) {
        Logger.log({
            level: 'error',
            message: 'No filepath in autocomplete',
        });
        await interaction.respond();
        return;
    }

    let file = getMDNFile(filepath);
    // If not file is found with the given path, check if it is a unique title
    if (!file) {
        const newFilePath = getPathFromTitle(filepath, interaction.commandName);
        file = getMDNFile(newFilePath);
        if (!file) {
            Logger.log({
                level: 'error',
                message: `[sectionAutocompleteHandler] No file found for query "${filepath}"`,
            });
            await interaction.respond();
            return;
        }
    }

    const sections = getAllSections(removeEmptySections(file));
    const filteredSections = sections.filter((section) => {
        if (SECTIONS_TO_REMOVE.includes(section.name)) return false;
        if (section.name.toLowerCase().includes(focusedValue)) return true;
        if (!focusedValue) return true;
    });

    // Truncate filtered  array to length of 25 per discord's limit
    let i = 1;
    const response = filteredSections.slice(0, 24).map((section) => ({
        name: `${'--'.repeat(focusedValue ? 0 : section.level - 2)} ${i++}. ${stripJsxRef(section.name.slice(0, 99))}`,
        value: hashString(JSON.stringify(section)),
    }));

    await interaction.respond(response);
};
