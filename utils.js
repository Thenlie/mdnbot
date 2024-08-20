/**
 * Removes the first two lines of a document, expecting this is a
 * markdown heading ('#') followed by an empty line
 * @param {string} doc
 * @returns
 */
const removeTitle = (doc) => {
    // Find the index of the second newline character
    const newlineIndex = doc.indexOf('\n', doc.indexOf('\n') + 1);
    // If there are fewer than two newlines, return the original string
    if (newlineIndex === -1) return doc;
    // Return the substring starting after the second newline
    return doc.substring(newlineIndex + 1);
};

/**
 * Cuts a string down to the discord character limit if needed
 * Appends '...' if the string was trimmed
 * @param {string} str
 * @returns
 */
const truncateString = (str) => {
    const MAX_LENGTH = 1024;
    return str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH - 3) + '...' : str;
};

/**
 * Creates and array of objects containing all titles and filepaths
 * from a given mdnman title file.
 * @param {string[]} titles
 * @returns
 */
const createChoicesFromTitles = (titles) => {
    return titles.map((title) => ({
        name: title.title,
        value: title.file,
    }));
};

export { removeTitle, truncateString, createChoicesFromTitles };
