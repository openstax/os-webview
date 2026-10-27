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

export function matchesSearch(
    book: {text?: string; title?: string},
    query: string
) {
    const tokens = searchTokens(query);
    const words = normalize([book.text, book.title].join(' ')).split(' ');

    return tokens.every((t) => words.some((w) => w.startsWith(t)));
}
