# censorship-id

[![npm version](https://img.shields.io/npm/v/censorship-id.svg?style=flat-square)](https://www.npmjs.com/package/censorship-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust, feature-rich, and lightweight Indonesian profanity filter. Fully redesigned for v2.0.0, it supports structured metadata detection, severity levels, categories, whitelisting, leetspeak evasion handling, and custom dictionary management.

## Features

- **Multi-purpose API**: Censor text, detect profane words with metadata (severity/category), or perform simple boolean checks.
- **Smart Mode**: Handles advanced evasion techniques (leetspeak, repeated characters, punctuation-in-word).
- **Categorization & Severity**: Dictionary entries are classified into categories (`vulgar`, `slur`, `sexual`, `offensive`, `slang`) and severity levels (`low`, `medium`, `high`).
- **Whitelisting**: Easily allow specific words to bypass filtering.
- **Dictionary Management**: Dynamically add or remove words globally at runtime.
- **Lightweight**: Zero production dependencies. Built for CJS and ESM with full TypeScript support.

## Installation

```bash
npm install censorship-id
```

## Reorganized Structure

```
censorship-id/
├── src/
│   ├── index.js          # Core filter implementation (detect, censorId, isProfane)
│   ├── dictionary.js     # Structured Indonesian profanity database
│   └── index.d.ts        # TypeScript declarations
├── test/
│   └── index.test.js     # Jest unit tests
├── dist/                 # Build outputs (CJS, ESM, Types)
└── package.json
```

---

## API Reference

### 1. `censorId(text, options)`

Replaces profane words with a mask character.

```javascript
const { censorId } = require("censorship-id");

// Basic
censorId("anjing kau!");
// => "****** kau!"

// Keep first and last letter
censorId("anjing kau!", { keepFirstAndLast: true });
// => "a****g kau!"

// Custom mask character
censorId("anjing kau!", { mask: "#" });
// => "###### kau!"
```

**Options:**

- `mask` (string, default: `*`): Mask character.
- `keepFirstAndLast` (boolean, default: `false`): Keep first and last letters visible.
- `allowedWords` (string[]): Words to bypass filtering.
- `customWords` (string[] | object[]): Additional words to censor.
- `smartMode` (boolean, default: `false`): Handle obfuscation (e.g., `4njing`, `baaaaabiii`).
- `minSeverity` (`'low' | 'medium' | 'high'`): Minimum severity level to censor.
- `categories` (string[]): Only censor specific categories (e.g., `['slur', 'sexual']`).

### 2. `detect(text, options)`

Scans text and returns structured metadata about all matches.

```javascript
const { detect } = require("censorship-id");

const results = detect("dasar anjing kau!");
console.log(results);
/*
Output:
[
  {
    match: "anjing",
    word: "anjing",
    index: 6,
    length: 6,
    severity: "high",
    category: "offensive"
  }
]
*/

// Using smartMode
detect("dasar 4njing!", { smartMode: true });
/*
Output:
[
  {
    match: "4njing",
    word: "anjing",
    index: 6,
    length: 6,
    severity: "high",
    category: "offensive"
  }
]
*/
```

**Options:** Same as `censorId` (minus `mask` and `keepFirstAndLast`) plus:

- `unique` (boolean, default: `false`): If `true`, only returns the first occurrence of each unique word.

### 3. `isProfane(text, options)`

Returns a boolean indicating if the text contains any profanity.

```javascript
const { isProfane } = require("censorship-id");

isProfane("Halo apa kabar?"); // => false
isProfane("Dasar anjing!"); // => true
isProfane("Dasar anjing!", { minSeverity: "high" }); // => true
```

### 4. Dictionary Management

Modify the default database at runtime.

```javascript
const { addWords, removeWords, getDictionary } = require("censorship-id");

// Add string words (assigns medium severity & custom category)
addWords(["perkosa", "bodoh"]);

// Add words with metadata
addWords([{ word: "jelek", severity: "low", category: "offensive" }]);

// Remove words
removeWords(["jelek", "bodoh"]);

// Retrieve copy of active dictionary
const activeDictionary = getDictionary();
```

---

## Severity & Categories

The package classifies Indonesian words into the following categories and levels:

| Category    | Level  | Description                              | Examples                                |
| ----------- | ------ | ---------------------------------------- | --------------------------------------- |
| `sexual`    | High   | Highly vulgar/anatomical terms           | `kontol`, `memek`, `ngentot`, `pepek`   |
| `slur`      | High   | Offensive slurs targeting identity       | `banci`, `bencong`, `lonte`, `perek`    |
| `offensive` | High   | Harsh expressions, insults               | `bangsat`, `bajingan`, `anjing`, `babi` |
| `vulgar`    | Medium | Inappropriate bodily or vulgar slang     | `berak`, `tai`, `sempak`                |
| `offensive` | Medium | Insulting terms for intellect            | `bego`, `goblok`, `tolol`, `dungu`      |
| `slang`     | Medium | Inappropriate regional slang/swear words | `anjir`, `cuk`, `dancuk`, `jancuk`      |
| `offensive` | Low    | Mild insults or slang                    | `buaya`, `najis`, `ndeso`, `kere`       |
| `vulgar`    | Low    | Mild sexual references, innuendo         | `bokep`, `sange`, `lendir`              |

---

## License

MIT © [rheatkhs](https://github.com/rheatkhs)
