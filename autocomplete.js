export const autocompleteHandler = async (interaction, choices) => {
    const focusedValue = interaction.options.getFocused();
    const filtered = choices.filter(choice => choice.name.includes(focusedValue));
    // Truncate filtered  array to length of 25 per discord's limit
    const response = filtered.slice(0, 24).map(choice => {
        return { name: choice.name.slice(0, 99), value: choice.value };
    });
    await interaction.respond(response);
};
