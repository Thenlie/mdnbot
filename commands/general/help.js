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
## Completion

MDN Bot relies on autocompletion to work properly. If you have issues with commands not executing, ensure you are selecting an autocomplete choice for each option rather than just typing something in. If you do not find what you are looking for in the autocomplete output, check for typos. If you still do not see what you are looking for, that document might not be included in MDN Bot.
## Issues

If you notice any issues with the bot, including missing or outdated MDN documents, please submit a bug report on [GitHub](https://github.com/Thenlie/mdnbot/issues).
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
