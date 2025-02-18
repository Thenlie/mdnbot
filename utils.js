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
    getAllSections,
} from 'mdnman';
import { Logger } from './logger.js';
import { createHash } from 'crypto';

const hashString = (str) => {
    return createHash('sha1').update(str).digest('hex');
};

/**
 * Executes each reference command. This runs for javascript, html and css
 * so make sure changes are language agnostic.
 */
const referenceCommandExecutor = async (interaction) => {
    const options = interaction.options._hoistedOptions;
    const query = options.find((obj) => obj.name === 'query').value;
    const filepath =
        interaction.commandName === 'javascript' ? 'lib/javascript/' + query + '/index.md' : query;
    const hashedSection = options.find((obj) => obj.name === 'section').value;

    if (!filepath || !hashedSection) {
        Logger.log({
            level: 'error',
            message: `[referenceCommandExecutor] No filepath or section provided! Filepath: ${filepath}, Section hash: ${hashedSection}`,
        });
        await interaction.reply();
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
                message: `[referenceCommandExecutor] No file found for query "${filepath}"`,
            });
            await interaction.reply();
            return;
        }
    }

    const sections = getAllSections(removeEmptySections(file));
    const sectionObject = sections.find((s) => hashString(JSON.stringify(s)) === hashedSection);

    const document = getSection(file, sectionObject);
    const header = getHeader(file);

    // Replacing level 4 headers with level 3 since Discord doesn't render level 4
    const strippedDoc = removeEmptyLines(
        removeEmptySections(convertEmojiTags(expandLinks(stripJsxRef(document))))
    ).replace(/^####/gm, '###');

    const embed = new EmbedBuilder()
        .setColor(0x3170d6)
        .setTitle(header.title)
        .setURL(`https://developer.mozilla.org/en-US/docs/${header.slug}`)
        .setDescription(truncateString(strippedDoc, 1024));

    await interaction.reply({ embeds: [embed] });
};

export { referenceCommandExecutor, hashString };
