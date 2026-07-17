/**
 * A single match result from detect().
 */
export interface Match {
  /** The matched text from the input (may differ from word in smartMode) */
  match: string;
  /** The dictionary word (normalized) */
  word: string;
  /** The index in the input string where the match starts */
  index: number;
  /** The length of the matched text */
  length: number;
  /** The severity level of the matched word */
  severity: string;
  /** The category of the matched word */
  category: string;
}

/**
 * A dictionary entry.
 */
export interface DictionaryEntry {
  word: string;
  severity: string;
  category: string;
}

/**
 * Options for the censorship filter.
 */
export interface CensorIdOptions {
  /**
   * The character used to mask the words.
   * @default '*'
   */
  mask?: string;

  /**
   * An array of additional words to censor.
   */
  customWords?: string[];

  /**
   * An array of words to exclude from censoring (whitelist).
   */
  allowedWords?: string[];

  /**
   * If true, keeps the first and last letters visible (e.g., "a****g").
   * @default false
   */
  keepFirstAndLast?: boolean;

  /**
   * If true, handles leetspeak (e.g., "4njing") and repeated characters (e.g., "baaaaaaabiii").
   * @default false
   */
  smartMode?: boolean;

  /**
   * Minimum severity level to include. Words below this severity are ignored.
   * Severity order: low < medium < high.
   */
  minSeverity?: "low" | "medium" | "high";

  /**
   * Only include words in these categories (e.g., ['offensive', 'slur']).
   */
  categories?: string[];

  /**
   * If true, only return the first occurrence of each unique word.
   * Only used by detect().
   * @default false
   */
  unique?: boolean;
}

/**
 * Censors Indonesian profanity and inappropriate words from the given text.
 *
 * @param text The input text to be filtered.
 * @param options Configuration for filtering behavior.
 * @returns The censored text.
 */
export function censorId(text: string, options?: CensorIdOptions): string;
export function censorId<T>(text: T, options?: CensorIdOptions): T;

/**
 * Detects profanity in text and returns structured results.
 *
 * @param text The input text to inspect.
 * @param options Detection options (same as CensorIdOptions, minus mask/keepFirstAndLast).
 * @returns An array of match objects with metadata.
 */
export function detect(text: string, options?: CensorIdOptions): Match[];

/**
 * Checks if the text contains profanity.
 *
 * @param text The input text to check.
 * @param options Detection options.
 * @returns True if profanity is found.
 */
export function isProfane(text: string, options?: CensorIdOptions): boolean;

/**
 * Add words to the default dictionary.
 * Accepts strings or objects with word/severity/category.
 */
export function addWords(
  words: (string | { word: string; severity?: string; category?: string })[],
): void;

/**
 * Remove words from the default dictionary.
 */
export function removeWords(words: string[]): void;

/**
 * Get a copy of the current default dictionary.
 */
export function getDictionary(): DictionaryEntry[];

/**
 * The default dictionary of Indonesian profanity used by the filter.
 */
export const dictionary: DictionaryEntry[];
