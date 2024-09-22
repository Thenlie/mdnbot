import { EmbedBuilder } from 'discord.js';
import {
    getMDNFile,
    getPathFromTitle,
    getSection,
    getHeader,
    removeEmptySections,
    convertEmojiTags,
    expandLinks,
    stripJsxRef,
    removeEmptyLines,
    truncateString,
} from 'mdnman';
import { Logger } from './logger.js';

/**
 * Executes each reference command. This runs for javascript, html and css
 * so make sure changes are language agnostic.
 */
const referenceCommandExecutor = async (interaction) => {
    const options = interaction.options._hoistedOptions;
    const filepath = options.find((obj) => obj.name === 'query').value;
    const section = options.find((obj) => obj.name === 'section').value;

    if (!filepath || !section) {
        Logger.log({
            level: 'error',
            message: `[referenceCommandExecutor] No filepath or section provided! Filepath: ${filepath}, Section: ${section}`,
        });
        await interaction.reply();
        return;
    }

    let file = getMDNFile(filepath);
    // If not file is found with the given path, check if it is a unique title
    if (!file) {
        const newFilePath = getPathFromTitle(filepath, 'javascript');
        file = getMDNFile(newFilePath);
        if (!file) {
            Logger.log({
                level: 'error',
                message: `[referenceCommandExecutor] No file found for query "${filepath}"`,
            });
            await interaction.reply();
            return;
        }
    }

    const document = getSection(file, section);
    const header = getHeader(file);

    const strippedDoc = removeEmptyLines(
        removeEmptySections(convertEmojiTags(expandLinks(stripJsxRef(document))))
    );

    const embed = new EmbedBuilder()
        .setColor(0x3170d6)
        .setTitle(header.title)
        .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
        .setDescription(truncateString(strippedDoc, 1024));

    await interaction.reply({ embeds: [embed] });
};

export { referenceCommandExecutor };
