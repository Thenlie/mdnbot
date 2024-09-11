import { getAllSections, getMDNFile, removeEmptySections } from 'mdnman';

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
        console.error('No filepath in autocomplete');
    }
    const file = getMDNFile(filepath);
    const sections = getAllSections(removeEmptySections(file));

    const filteredSections = sections.filter(
        (section) => !SECTIONS_TO_REMOVE.includes(section.name)
    );

    await interaction.respond(
        filteredSections.map((section) => ({ name: section.name, value: section.name }))
    );
};
