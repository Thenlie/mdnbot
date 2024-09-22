import { getAllSections, getMDNFile, removeEmptySections, getPathFromTitle } from 'mdnman';
import { Logger } from './logger.js';

export const queryAutocompleteHandler = async (interaction, choices) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const focusedValues = focusedValue.split(/\.| |-/);
    const filtered = choices.filter((choice) =>
        focusedValues.every((value) => choice.name.toLowerCase().includes(value))
    );
    // Truncate filtered  array to length of 25 per discord's limit
    const response = filtered.slice(0, 24).map((choice) => {
        return { name: choice.name.slice(0, 99), value: choice.value };
    });
    await interaction.respond(response);
};

const SECTIONS_TO_REMOVE = ['See also', 'Browser compatibility', 'Specifications'];

export const sectionAutocompleteHandler = async (interaction) => {
    const options = interaction.options._hoistedOptions;
    const filepath = options.find((obj) => obj.name === 'query').value;
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
    const filteredSections = sections.filter(
        (section) => !SECTIONS_TO_REMOVE.includes(section.name)
    );
    // Truncate filtered  array to length of 25 per discord's limit
    const response = filteredSections.slice(0, 24).map((section) => ({
        name: section.name,
        value: section.name,
    }));
    await interaction.respond(response);
};
