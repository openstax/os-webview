import pageData from '../src/data/partners';
import subjectData from '../src/data/subject-categories';
import footerData from '../src/data/footer';
import booksData from '../src/data/books';
import bookTitleData from '../src/data/book-titles';
import osNewsData from '../src/data/openstax-news';
import teamData from '../src/data/team';
import osTutorData from '../src/data/openstax-tutor';
import booksForAnalyticsData from '../src/data/books-for-analytics';

global.fetch = jest.fn().mockImplementation((...args) => {
    const isPartner = (/pages\/partners/).test(args[0]);
    const isFooter = (/api\/footer/).test(args[0]);
    const isSubjects = (/snippets\/subjects/).test(args[0]);
    const isBooks = (/api\/books/).test(args[0]);
    const isBookTitles = (/fields=title,id/).test(args[0]);
    const isOsNews = (/slug=openstax-news/).test(args[0]);
    const isTeam = (/pages\/team/).test(args[0]);
    const isOsTutor = (/pages\/openstax-tutor/).test(args[0]);
    const isBooksForAnalytics = (/book_student_resources/).test(args[0]);

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
            } else if (isTeam) {
                payload = teamData;
            } else if (isOsTutor) {
                payload = osTutorData;
            } else if (isBooksForAnalytics) {
                payload = booksForAnalyticsData;
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
