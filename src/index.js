const defaultDictionary = require("./dictionary");

// Leetspeak mapping
const leetMap = {
  4: "a",
  3: "e",
  1: "i",
  0: "o",
  5: "s",
  7: "t",
  8: "b",
  9: "g",
  "@": "a",
  $: "s",
  "!": "i",
  "(": "c",
};

const severityOrder = ["low", "medium", "high"];

/**
 * Build a sorted, filtered list of dictionary entries.
 */
function buildEntries(options = {}) {
  const {
    customWords = [],
    allowedWords = [],
    minSeverity,
    categories,
  } = options;

  let entries = [...defaultDictionary];

  // Filter by minimum severity
  if (minSeverity) {
    const minIdx = severityOrder.indexOf(minSeverity);
    if (minIdx >= 0) {
      entries = entries.filter(
        (e) => severityOrder.indexOf(e.severity) >= minIdx,
      );
    }
  }

  // Filter by categories
  if (categories && categories.length > 0) {
    entries = entries.filter((e) => categories.includes(e.category));
  }

  // Add custom words (supports strings or objects)
  for (const w of customWords) {
    if (typeof w === "string") {
      if (!entries.some((e) => e.word === w)) {
        entries.push({ word: w, severity: "medium", category: "custom" });
      }
    } else if (w && w.word) {
      if (!entries.some((e) => e.word === w.word)) {
        entries.push({
          word: w.word,
          severity: w.severity || "medium",
          category: w.category || "custom",
        });
      }
    }
  }

  // Remove allowed words
  if (allowedWords.length > 0) {
    const allowedLower = new Set(allowedWords.map((w) => w.toLowerCase()));
    entries = entries.filter((e) => !allowedLower.has(e.word.toLowerCase()));
  }

  entries.sort((a, b) => b.word.length - a.word.length);

  return entries;
}

/**
 * Build a combined regex with per-word capturing groups for metadata lookup.
 */
function buildRegex(entries, smartMode) {
  if (entries.length === 0) return null;

  if (smartMode) {
    const patterns = entries
      .map((entry) => {
        const word = entry.word;
        const charPatterns = Array.from(word).map((char, index) => {
          const lowerChar = char.toLowerCase();
          const leetChars = Object.keys(leetMap).filter(
            (key) => leetMap[key] === lowerChar,
          );
          const variants = [lowerChar, ...leetChars].map((c) =>
            c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          );
          const suffix = index === word.length - 1 ? "+" : "+[^a-zA-Z0-9]*";
          return `[${variants.join("")}]${suffix}`;
        });
        return `(${charPatterns.join("")})`;
      })
      .join("|");
    return new RegExp(
      `(?<=\\s|^|[^a-zA-Z0-9])(${patterns})(?=\\s|$|[^a-zA-Z0-9])`,
      "gi",
    );
  } else {
    const pattern = entries
      .map((entry) => `(${entry.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`)
      .join("|");
    return new RegExp(
      `(?<=\\s|^|[^a-zA-Z0-9])(${pattern})(?=\\s|$|[^a-zA-Z0-9])`,
      "gi",
    );
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Detect profanity in text and return structured results.
 *
 * @param {string} text - The input text to inspect.
 * @param {object} options - Detection options.
 * @param {string[]} [options.customWords] - Additional words to detect.
 * @param {string[]} [options.allowedWords] - Words to exclude from detection.
 * @param {boolean} [options.smartMode] - Handle leetspeak, repeats, punctuation.
 * @param {'low'|'medium'|'high'} [options.minSeverity] - Minimum severity to include.
 * @param {string[]} [options.categories] - Only include these categories.
 * @param {boolean} [options.unique] - Only return first occurrence of each word.
 * @returns {Array<{match: string, word: string, index: number, length: number, severity: string, category: string}>}
 */
function detect(text, options = {}) {
  if (typeof text !== "string") return [];

  const { unique = false } = options;
  const entries = buildEntries(options);
  if (entries.length === 0) return [];

  const smartMode = options.smartMode || false;
  const regex = buildRegex(entries, smartMode);
  if (!regex) return [];

  const results = [];
  const seen = new Set();

  for (const m of text.matchAll(regex)) {
    // m[0] = full match text
    // m[1] = group 1 (whole alternation)
    // m[2..] = per-word groups

    let entryIdx = -1;
    for (let i = 2; i < m.length; i++) {
      if (m[i] !== undefined) {
        entryIdx = i - 2;
        break;
      }
    }

    if (entryIdx < 0) continue;

    const entry = entries[entryIdx];

    if (unique) {
      if (seen.has(entry.word)) continue;
      seen.add(entry.word);
    }

    results.push({
      match: m[1],
      word: entry.word,
      index: m.index,
      length: m[0].length,
      severity: entry.severity,
      category: entry.category,
    });
  }

  return results;
}

/**
 * Check if text contains profanity.
 *
 * @param {string} text - The input text to check.
 * @param {object} options - Same options as detect().
 * @returns {boolean}
 */
function isProfane(text, options = {}) {
  return detect(text, { ...options, unique: false }).length > 0;
}

/**
 * Censor Indonesian profanity and inappropriate words.
 *
 * @param {string} text - The input text to be filtered.
 * @param {object} options - Filtering options.
 * @param {string} [options.mask='*'] - Character used to mask words.
 * @param {string[]} [options.customWords] - Additional words to censor.
 * @param {string[]} [options.allowedWords] - Words to exclude from censoring.
 * @param {boolean} [options.keepFirstAndLast] - Keep first/last letters visible.
 * @param {boolean} [options.smartMode] - Handle leetspeak, repeats, punctuation.
 * @param {'low'|'medium'|'high'} [options.minSeverity] - Minimum severity to censor.
 * @param {string[]} [options.categories] - Only censor these categories.
 * @returns {string}
 */
function censorId(text, options = {}) {
  if (typeof text !== "string") return text;

  const { mask = "*", keepFirstAndLast = false } = options;

  const entries = buildEntries(options);
  if (entries.length === 0) return text;

  const smartMode = options.smartMode || false;
  const regex = buildRegex(entries, smartMode);
  if (!regex) return text;

  return text.replace(regex, (match) => {
    if (keepFirstAndLast && match.length > 2) {
      const first = match[0];
      const last = match[match.length - 1];
      const middle = mask.repeat(match.length - 2);
      return first + middle + last;
    }
    return mask.repeat(match.length);
  });
}

// ─── Dictionary Management ───────────────────────────────────────────────────

/**
 * Add words to the default dictionary.
 *
 * @param {(string|{word:string,severity?:string,category?:string})[]} words
 */
function addWords(words) {
  const list = Array.isArray(words) ? words : [words];
  for (const w of list) {
    if (typeof w === "string") {
      if (!defaultDictionary.some((e) => e.word === w)) {
        defaultDictionary.push({
          word: w,
          severity: "medium",
          category: "custom",
        });
      }
    } else if (w && w.word) {
      if (!defaultDictionary.some((e) => e.word === w.word)) {
        defaultDictionary.push({
          word: w.word,
          severity: w.severity || "medium",
          category: w.category || "custom",
        });
      }
    }
  }
}

/**
 * Remove words from the default dictionary.
 *
 * @param {string[]} words
 */
function removeWords(words) {
  const lowerSet = new Set(words.map((w) => w.toLowerCase()));
  for (let i = defaultDictionary.length - 1; i >= 0; i--) {
    if (lowerSet.has(defaultDictionary[i].word.toLowerCase())) {
      defaultDictionary.splice(i, 1);
    }
  }
}

/**
 * Get a copy of the current default dictionary.
 *
 * @returns {Array<{word:string,severity:string,category:string}>}
 */
function getDictionary() {
  return [...defaultDictionary];
}

module.exports = {
  censorId,
  detect,
  isProfane,
  addWords,
  removeWords,
  getDictionary,
  dictionary: defaultDictionary,
};
