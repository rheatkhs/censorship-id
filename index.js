const defaultDictionary = require("./dictionary");

/**
 * Censor Indonesian profanity and inappropriate words.
 *
 * @param {string} text - The input text to be filtered.
 * @param {object} options - Filtering options.
 * @param {string} options.mask - The character used to mask the words (default is '*').
 * @param {string[]} options.customWords - An array of additional words to censor.
 * @param {boolean} options.keepFirstAndLast - If true, keeps the first and last letters visible (default is false).
 * @returns {string} - The censored text.
 */
function censorId(text, options = {}) {
    if (typeof text !== "string") {
        return text;
    }

    const {
        mask = "*",
        customWords = [],
        keepFirstAndLast = false
    } = options;

    // Merge default dictionary with custom words
    const wordsToCensor = [...new Set([...defaultDictionary, ...customWords])];

    // Escape special characters in words for safety in Regex
    const escapedWords = wordsToCensor.map(word =>
        word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    let censoredText = text;

    // Iterate over each word and apply masking
    escapedWords.forEach(word => {
        // Regex with word boundaries (\b) and case-insensitive flag (i)
        // Note: \b doesn't work well with non-ASCII characters, but for Indonesian it's generally fine.
        // However, for more robustness with various symbols, we use a pattern that matches word start/end.
        const regex = new RegExp(`(?<=\\s|^|[^a-zA-Z0-9])${word}(?=\\s|$|[^a-zA-Z0-9])`, "gi");

        censoredText = censoredText.replace(regex, (match) => {
            if (keepFirstAndLast && match.length > 2) {
                const first = match[0];
                const last = match[match.length - 1];
                const middle = mask.repeat(match.length - 2);
                return first + middle + last;
            }
            return mask.repeat(match.length);
        });
    });

    return censoredText;
}

module.exports = {
    censorId,
    dictionary: defaultDictionary
};
