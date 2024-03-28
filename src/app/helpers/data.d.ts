// Types for data.js (until it gets converted to TS)

export function useToggle(
    initialState?: boolean
): [boolean, (state?: boolean) => boolean];

export function htmlToText(
    html: string
): string;
