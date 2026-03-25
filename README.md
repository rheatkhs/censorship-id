# censorship-id

[![npm version](https://img.shields.io/npm/v/censorship-id.svg?style=flat-square)](https://www.npmjs.com/package/censorship-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust and simple npm package for detecting and masking Indonesian profanity, slang, and inappropriate words.

## Features

- **Smart Detection**: Optional `smartMode` to handle leetspeak (e.g., `4njing`), repeated characters (e.g., `baaaaaabiii`), and punctuation insertion (e.g., `a.n.j.i.n.g`).
- **Comprehensive Dictionary**: Pre-loaded with common Indonesian bad words.
- **Regex Powered**: Uses word boundaries to avoid false positives (e.g., masking "tai" but not "pantai").
- **Customizable**: Add your own words to the list and choose your mask character.
- **Keep First and Last**: Option to keep the first and last letters visible for better context.
- **Case-Insensitive**: Matches words regardless of their case.
- **Lightweight**: Zero dependencies (only uses Jest for development).

## Installation

```bash
npm install censorship-id
```

## Usage

### Basic Usage

```javascript
const { censorId } = require('censorship-id');

const text = "Dasar anjing kau, babi!";
const censored = censorId(text);
console.log(censored); 
// Output: Dasar ****** kau, ****!
```

### Advanced Usage (Options)

```javascript
const { censorId } = require('censorship-id');

const text = "Dasar anjing kau, babi!";

// 1. Using a custom mask
const customMask = censorId(text, { mask: '#' });
console.log(customMask);
// Output: Dasar ###### kau, ####!

// 2. Keeping first and last letters
const visible = censorId(text, { keepFirstAndLast: true });
console.log(visible);
// Output: Dasar a****g kau, b**i!

// 3. Adding custom words to censor
const customWords = censorId("Kamu sangat malas!", { customWords: ['malas'] });
console.log(customWords);
// Output: Kamu sangat *****!

// 4. Smart Mode (handles leetspeak & repeats)
const smart = censorId("D4s4r 4njing!", { smartMode: true });
console.log(smart);
// Output: D4s4r ******!

const repeats = censorId("baaaaaaaabiiiiii", { smartMode: true });
console.log(repeats);
// Output: ****************
```

## API Reference

### `censorId(text, options)`

- **`text`** (string): The input text to be filtered.
- **`options`** (object): Optional configuration.
  - **`mask`** (string): The character used to mask words (default: `*`).
  - **`customWords`** (string[]): Additional words to censor.
  - **`keepFirstAndLast`** (boolean): If `true`, the first and last letters of the word remain visible (default: `false`).
  - **`smartMode`** (boolean): If `true`, detects leetspeak and repeated characters (default: `false`).

## License

MIT © [rheatkhs](https://github.com/rheatkhs)
