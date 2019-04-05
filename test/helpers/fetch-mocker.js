import pageData from '../src/data/partners';
import subjectData from '../src/data/subject-categories';
import footerData from '../src/data/footer';
import booksData from '../src/data/books';
import bookTitleData from '../src/data/book-titles';
import osNewsData from '../src/data/openstax-news';

global.fetch = jest.fn().mockImplementation((...args) => {
    const isPartner = (/pages\/partners/).test(args[0]);
    const isFooter = (/api\/footer/).test(args[0]);
    const isSubjects = (/snippets\/subjects/).test(args[0]);
    const isBooks = (/api\/books/).test(args[0]);
    const isBookTitles = (/fields=title,id/).test(args[0]);
    const isOsNews = (/slug=openstax-news/).test(args[0]);

    console.info('Fetch', args[0]);
    return new Promise(
        function (resolve, reject) {
            let payload = {};

            if (isPartner) {
                payload = pageData;
            } else if (isFooter) {
                payload = footerData;
            } else if (isSubjects) {
                payload = subjectData;
            } else if (isBooks) {
                payload = booksData;
            } else if (isBookTitles) {
                payload = bookTitleData;
            } else if (isOsNews) {
                payload = osNewsData;
            } else {
                console.warn("rejecting", args);
            }
            resolve({
                ok: true,
                json() {
                    return payload;
                }
            })
        }
    );
});
