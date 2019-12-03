import cmsFetch from './cmsFetch';

export default cmsFetch('books?format=json')
    .then((r) => r.books);

export function salesforceTitles(books) {
    const seenTitles = {};

    return Object.keys(books)
        .map((key) => books[key])
        .filter((book) => {
            const abbrev = book.salesforce_abbreviation;
            const seen = abbrev in seenTitles;

            if (book.book_state === 'live') {
                seenTitles[abbrev] = true;
            }
            return abbrev && !seen && book.book_state === 'live';
        })
        .map((book) => ({
            text: book.salesforce_name,
            value: book.salesforce_abbreviation,
            comingSoon: book.book_state === 'coming_soon',
            subjects: book.is_ap ? ['AP'] : book.subjects,
            coverUrl: book.cover_url
        }))
        .sort((a, b) => a.text < b.text ? -1 : 1);
}

export function subjects(sfTitles) {
    return sfTitles.reduce((a, b) => a.concat(b.subjects), [])
        .reduce((a, b) => a.includes(b) ? a : a.concat(b), []);
}
