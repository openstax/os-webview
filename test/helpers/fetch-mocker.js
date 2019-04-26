import adoptionFormData from '../src/data/adoption-form';
import biologyData from '../src/data/details-biology-2e';
import booksData from '../src/data/books';
import booksForAnalyticsData from '../src/data/books-for-analytics';
import bookTitleData from '../src/data/book-titles';
import footerData from '../src/data/footer';
import institutionalPartnershipData from '../src/data/institutional-partnership';
import osNewsData from '../src/data/openstax-news';
import osNewsDetailData from '../src/data/openstax-news-detail';
import blogArticleData from '../src/data/blog-article';
import teamData from '../src/data/team';
import osTutorData from '../src/data/openstax-tutor';
import pageData from '../src/data/partners';
import polishData from '../src/data/details-polish';
import researchData from '../src/data/research';
import rolesData from '../src/data/roles';
import schoolsData from '../src/data/schools';
import stickyData from '../src/data/sticky';
import subjectData from '../src/data/subject-categories';
import teamData from '../src/data/team';
import technologyData from '../src/data/technology';
import userData from '../src/data/user';

global.fetch = jest.fn().mockImplementation((...args) => {
    const isAdoption = (/pages\/adoption-form/).test(args[0]);
    const isBiology = (/v2\/pages\/207/).test(args[0]);
    const isBooks = (/api\/books/).test(args[0]);
    const isBooksForAnalytics = (/book_student_resources/).test(args[0]);
    const isBookTitles = (/fields=title,id/).test(args[0]);
    const isFooter = (/api\/footer/).test(args[0]);
    const isInstitutionalPartnership = (/pages\/institutional-partner-program/).test(args[0]);
    const isOsNews = (/slug=openstax-news/).test(args[0]);
    const isOsNewsDetail = (/v2\/pages\/90/).test(args[0]);
    const isBlogArticle = (/blog-article/).test(args[0]);
    const isTeam = (/pages\/team/).test(args[0]);
    const isOsTutor = (/pages\/openstax-tutor/).test(args[0]);
    const isPartner = (/pages\/partners/).test(args[0]);
    const isPolishPhysics = (/v2\/pages\/190/).test(args[0]);
    const isResearch = (/pages\/research/).test(args[0]);
    const isRoles = (/snippets\/roles/).test(args[0]);
    const isSchools = (/salesforce\/schools/).test(args[0]);
    const isSticky = (/api\/sticky/).test(args[0]);
    const isSubjects = (/snippets\/subjects/).test(args[0]);
    const isTeam = (/pages\/team/).test(args[0]);
    const isTechnology = (/pages\/technology/).test(args[0]);
    const isUser = (/accounts.*\/api\/user/).test(args[0]);

    return new Promise(
        function (resolve, reject) {
            let payload = {};

            if (isAdoption) {
                payload = adoptionFormData;
            } else if (isPartner) {
                payload = pageData;
            } else if (isFooter) {
                payload = footerData;
            } else if (isInstitutionalPartnership) {
                payload = institutionalPartnershipData;
            } else if (isSubjects) {
                payload = subjectData;
            } else if (isBiology) {
                payload = biologyData;
            } else if (isPolishPhysics) {
                payload = polishData;
            } else if (isBooks) {
                payload = booksData;
            } else if (isBookTitles) {
                payload = bookTitleData;
            } else if (isOsNews) {
                payload = osNewsData;
            } else if (isOsNewsDetail) {
                payload = osNewsDetailData;
            } else if (isBlogArticle) {
                payload = blogArticleData;
            } else if (isTeam) {
                payload = teamData;
            } else if (isOsTutor) {
                payload = osTutorData;
            } else if (isBooksForAnalytics) {
                payload = booksForAnalyticsData;
            } else if (isResearch) {
                payload = researchData;
            } else if (isRoles) {
                payload = rolesData;
            } else if (isSchools) {
                payload = schoolsData;
            } else if (isSticky) {
                payload = stickyData;
            } else if (isTechnology) {
                payload = technologyData;
            } else if (isUser) {
                payload = userData;
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

window.ga = () => {};
