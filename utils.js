import { EmbedBuilder } from 'discord.js';
import {
    getMDNFile,
    getPathFromTitle,
    getSection,
    getHeader,
    removeEmptySections,
    convertEmojiTags,
    truncateString,
    getAllSections,
    completeParse,
    transformKumascript,
    getIntroSection,
} from 'mdnman';
import { Logger } from './logger.js';
import { createHash } from 'crypto';

const hashString = (str) => {
    return createHash('sha1').update(str).digest('hex');
};

const removeBrokenMarkdownLink = (text) => {
    // Regex to match an incomplete image markdown link at the end of the string
    const brokenLinkPattern = /!?\[.*?\]\([^)]*$/;

    // If there's a match at the end, remove it
    if (brokenLinkPattern.test(text)) {
        return text.replace(brokenLinkPattern, '...').trim();
    }
    return text;
};

/**
 * Remove HTML tables that are not within a codeblock
 * and insert a message explaining tables are not supported
 */
const removeHtmlTable = (document) => {
    const newDoc = [];
    const docArr = document.split('\n');

    let inTable = false;
    let inCodeblock = false;
    docArr.forEach((line) => {
        if (line.startsWith('```') && !inCodeblock) {
            inCodeblock = true;
            newDoc.push(line);
        } else if (line.startsWith('```') && inCodeblock) {
            inCodeblock = false;
            newDoc.push(line);
        } else if (line.startsWith('<table') && !inCodeblock) {
            inTable = true;
        } else if (line.startsWith('</table>') && inTable) {
            inTable = false;
            newDoc.push(
                "`🚧 HTML Table's are not yet supported in MDN Bot! 🚧\n🚧 View the table on the MDN website by clicking the title 🚧`"
            );
        } else if (!inTable) {
            newDoc.push(line);
        }
    });
    return newDoc.join('\n');
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
    const sectionChoice = options.find((obj) => obj.name === 'section');
    const hashedSection = sectionChoice.value;

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

    const sections = getAllSections(removeEmptySections(transformKumascript(file)));
    const sectionObject = sections.find((s) => hashString(JSON.stringify(s)) === hashedSection);
    const section =
        sectionObject.name === 'Introduction'
            ? getIntroSection(file)
            : getSection(file, sectionObject);
    const header = getHeader(file);
    const parsedSection = completeParse(convertEmojiTags(removeHtmlTable(section)), header.slug);
    const formattedSection = parsedSection
        // Replace level 4 headers with level 3 since Discord doesn't render level 4
        .replace(/^####/gm, '###')
        // Remove consecutive spaces
        .replace(/ {2,}/g, ' ')
        // Shorten consecutive hyphens
        .replace(/-{5,}/g, '----')
        // Add a space to empty block quotes
        .replace('>\n', '> \n')
        // Style Deprecation notice
        .replace(
            'Deprecated: This feature is no longer recommended',
            '```diff\n- Deprecated: This feature is no longer recommended\n```'
        );

    const finalSection = truncateString(formattedSection, 1024);

    const embed = new EmbedBuilder()
        .setColor(0x3170d6)
        .setTitle(header.title)
        .setURL(
            `https://developer.mozilla.org/en-US/docs/${header.slug}#${sectionObject.name.toLowerCase().replaceAll(' ', '_')}`
        )
        .setDescription(removeBrokenMarkdownLink(finalSection));

    await interaction.reply({ embeds: [embed] });
};

export { referenceCommandExecutor, hashString, removeHtmlTable };
