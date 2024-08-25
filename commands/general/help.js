import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const description = `
## Commands
 
- \`javascript\` - Query the JavaScript section of the MDN docs
 - \`query\` - Document to return. Matches the document name. Use autocomplete results for best performance.
 - \`section\` - The section within the document to return. Matches the section title.
- \`html\` - Query the HTML section of the MDN docs
 - \`query\` - Document to return. Matches the document name. Use autocomplete results for best performance.
 - \`section\` - The section within the document to return. Matches the section title.
- \`css\` - Query the CSS section of the MDN docs
 - \`query\` - Document to return. Matches the document name. Use autocomplete results for best performance.
 - \`section\` - The section within the document to return. Matches the section title.
`;

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get information about the MDN bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor(0x3170d6).setDescription(description);

        await interaction.reply({ embeds: [embed] });
    },
};
