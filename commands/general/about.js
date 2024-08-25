import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const description =
    "The MDN Bot is a discord bot that is capable of querying the MDN Web docs and returning sections of those docs to users on discord. It is intended to be used as a reference tool for web developers and as utility for community support members to easily share documentation and example with people they are helping.\n\nCheck out the project on GitHub at https://github.com/Thenlie/mdnbot\nDon't forget to leave a ⭐";

const footer = 'Created By Thenlie, 2024';

export default {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get information about the MDN bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x3170d6)
            .setDescription(description)
            .setFooter({ text: footer });

        await interaction.reply({ embeds: [embed] });
    },
};
