import { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } from 'discord.js';

const attachment = new AttachmentBuilder('./assets/mdn_logo.jpg', { name: 'img.jpg' });

const description = `
## About

The MDN Bot is a discord bot that queries the MDN Web docs and returns sections of those docs to users on discord. It is intended to be used as a reference tool for web developers and as utility for community support members to easily share documentation and examples with people they are helping.

Check out the project on [GitHub](https://github.com/Thenlie/mdnbot) and don't forget to leave a ⭐
## Credits

This project would not be possible without the incredible work done by the [Mozilla Team](https://github.com/mdn) on the [MDN Web Docs](https://developer.mozilla.org/en-US/).
`;

const footer = `Created By Thenlie, 2024. version ${process.env.npm_package_version}`;

export default {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get information about the MDN bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x3170d6)
            .setDescription(description)
            .setThumbnail(`attachment://${attachment.name}`)
            .setFooter({ text: footer, iconURL: 'https://imgur.com/NZTgw2m.png' });

        await interaction.reply({ embeds: [embed], files: [attachment] });
    },
};
