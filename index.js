const defaultDictionary = require("./dictionary");

// Leetspeak mapping
const leetMap = {
    "4": "a",
    "3": "e",
    "1": "i",
    "0": "o",
    "5": "s",
    "7": "t",
    "8": "b",
    "9": "g",
    "@": "a",
    "$": "s",
    "!": "i",
    "(": "c"
};

/**
 * Censor Indonesian profanity and inappropriate words.
 *
 * @param {string} text - The input text to be filtered.
 * @param {object} options - Filtering options.
 * @param {string} options.mask - The character used to mask the words (default is '*').
 * @param {string[]} options.customWords - An array of additional words to censor.
 * @param {boolean} options.keepFirstAndLast - If true, keeps the first and last letters visible (default is false).
 * @param {boolean} options.smartMode - If true, handles leetspeak and repeated characters (default is false).
 * @returns {string} - The censored text.
 */
function censorId(text, options = {}) {
    if (typeof text !== "string") {
        return text;
    }

    const {
        mask = "*",
        customWords = [],
        keepFirstAndLast = false,
        smartMode = false
    } = options;

    // Merge default dictionary with custom words and sort by length descending
    const wordsToCensor = [...new Set([...defaultDictionary, ...customWords])].sort((a, b) => b.length - a.length);

    let censoredText = text;

    // Iterate over each word and apply masking
    wordsToCensor.forEach(word => {
        let searchPattern;
        if (smartMode) {
            // Create a pattern that allows:
            // 1. Any number of repeats for each character (e.g., a+n+j+i+n+g+)
            // 2. Optional non-alphanumeric characters between letters (e.g., a[...]*n[...]*j)
            // 3. Mapping of leetspeak characters

            const charPatterns = Array.from(word).map((char, index) => {
                const lowerChar = char.toLowerCase();
                const leetChars = Object.keys(leetMap).filter(key => leetMap[key] === lowerChar);
                const variants = [lowerChar, ...leetChars].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

                // Only allow non-alphanumeric between characters, not after the last one
                const suffix = index === word.length - 1 ? "+" : "+[^a-zA-Z0-9]*";
                return `[${variants.join("")}]${suffix}`;
            });

            searchPattern = charPatterns.join("");
        } else {
            // Standard escaping for regex
            searchPattern = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        const regex = new RegExp(`(?<=\\s|^|[^a-zA-Z0-9])${searchPattern}(?=\\s|$|[^a-zA-Z0-9])`, "gi");

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
