const numeric = /^\d+$/;
const editionToken = /^\d+(st|nd|rd|th|e)$/;

function normalize(s: string) {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// The form asks for the title even when the edition differs, so "Biology 3e" still finds Biology
export function searchTokens(query: string) {
    return normalize(query)
        .split(' ')
        .filter((t) => t && t !== 'edition' && !editionToken.test(t));
}

// A bare number must be a whole word, or "2" would match "2e", "20" and every other edition
function wordMatches(word: string, token: string) {
    return numeric.test(token) ? word === token : word.startsWith(token);
}

export function matchesSearch(
    book: {text?: string; title?: string; searchableTitles?: string[]},
    query: string
) {
    const tokens = searchTokens(query);
    const words = normalize(
        [book.text, book.title, ...(book.searchableTitles ?? [])].join(' ')
    ).split(' ');

    return tokens.every((t) => words.some((w) => wordMatches(w, t)));
}
