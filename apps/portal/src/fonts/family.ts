const DEFAULT_FONT_FAMILY =
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji'

/*
 * Mantine's default font stack, preceded by the arabic font (see ./arabic.ts) which only applies to arabic characters.
 * */
export const APP_FONT_FAMILY = `var(--font-arabic), ${DEFAULT_FONT_FAMILY}`
