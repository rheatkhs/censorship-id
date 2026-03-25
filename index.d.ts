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
     * If true, keeps the first and last letters visible (e.g., "a****g").
     * @default false
     */
    keepFirstAndLast?: boolean;
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
 * The default dictionary of Indonesian profanity used by the filter.
 */
export const dictionary: string[];
