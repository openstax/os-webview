export type Book = {
    salesforce_abbreviation: string;
    book_state: string;
    salesforce_name: string;
    cover_url: string;
    subjects: string[];
    slug: string;
};

const statesToInclude = ['live', 'new_edition_available', 'coming_soon'];

export const filterLiveBooks = (entry: Book) =>
    statesToInclude.includes(entry.book_state);

function BookToSalesforceBook(book: Book) {
    return {
        text: book.salesforce_name,
        value: book.salesforce_abbreviation,
        comingSoon: book.book_state === 'coming_soon',
        subjects: book.subjects,
        coverUrl: book.cover_url
    };
}

export type SalesforceBook = ReturnType<typeof BookToSalesforceBook>;

export function salesforceTitles(books: {[key: string]: Book}) {
    const seenTitles: {[key: string]: boolean} = {};

    return Object.keys(books)
        .map((key) => books[key])
        .filter(filterLiveBooks)
        .filter((book) => {
            const abbrev = book.salesforce_abbreviation;
            const seen = abbrev in seenTitles;

            seenTitles[abbrev] = true;
            return abbrev && !seen;
        })
        .map(BookToSalesforceBook)
        .sort((a, b) => (a.text < b.text ? -1 : 1));
}

export function subjects(sfTitles: Book[]) {
    return sfTitles
        .reduce<string[]>((a, b) => a.concat(b.subjects), [])
        .reduce<string[]>((a, b) => (a.includes(b) ? a : a.concat(b)), []);
}
