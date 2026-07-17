# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-07-17

### Added

- Added MIT `LICENSE` file.
- Added `repository`, `bugs`, `homepage` fields to `package.json`.
- Added `"sideEffects": false` for better tree-shaking.

### Changed

- Updated TypeScript types: `Match.severity` and `DictionaryEntry.severity` now use `"low" | "medium" | "high"` union instead of `string`.
- Bumped minimum Node engine from `>=12.0.0` to `>=16.0.0`.
- Removed broken `lint` script (no ESLint config).

## [2.0.0] - 2026-07-17

### Added

- **New `detect(text, options)` API**: Returns structured match metadata (word, index, length, severity, category).
- **New `isProfane(text, options)` API**: Simple boolean check for profanity presence.
- **Dictionary management**: `addWords()`, `removeWords()`, `getDictionary()` to modify dictionary globally.
- **Severity levels**: Each dictionary entry tagged with severity (`low`, `medium`, `high`). Filter with `minSeverity` option.
- **Categories**: Dictionary entries organized by category (`vulgar`, `slur`, `sexual`, `offensive`, `slang`). Filter with `categories` option.
- **Combined regex engine**: Single pattern replaces per-word iteration, ~10x faster on long texts.
- `allowedWords` whitelist option to prevent false positives.

### Changed

- **BREAKING**: Dictionary format changed from `string[]` to `{ word, severity, category }[]`.
- **BREAKING**: `dictionary` export now returns structured objects instead of flat strings.
- **BREAKING**: Source code reorganized into `src/` directory.
- Tests moved to `test/` directory.

## [1.1.0] - 2026-03-25

### Added

- Expanded dictionary with 50+ new Indonesian slang words and vulgarities.
- Sorted dictionary alphabetically for better maintenance.
- **Smart Mode**: New detection engine for obfuscated words.
  - Added leetspeak detection (e.g., mapping `4` to `a`, `1` to `i`, etc.).
  - Added repeated character handling (e.g., `baaaaabiii` detection).
  - Added punctuation-in-word detection (e.g., `a.n.j.i.n.g` detection).
- Updated TypeScript definitions with `smartMode` option.
- Added comprehensive tests for normalization and evasion techniques.

## [1.0.0] - 2026-03-25

### Added

- Initial release of `censorship-id`.
- Core function `censorId(text, options)` for text screening.
- Standard Indonesian profanity dictionary with 30+ common words.
- Option `mask` to customize the censoring character.
- Option `customWords` to add additional words to the blacklist.
- Option `keepFirstAndLast` to maintain context while censoring.
- Robust Regex implementation with word boundaries.
- **Modern Build System**: Support for both CommonJS and ES Modules.
- **TypeScript Support**: Included IDE definitions (`.d.ts`) for better developer experience.
- Comprehensive Jest unit tests.
- Professional README and documentation.
- Standard `.gitignore` and `.npmignore` configuration.
