# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
