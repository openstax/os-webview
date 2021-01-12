import adoptionFormData from '../src/data/adoption-form';
import biologyData from '../src/data/details-biology-2e';
import blogArticleData from '../src/data/blog-article';
import booksData from '../src/data/books';
import booksForAnalyticsData from '../src/data/books-for-analytics';
import bookTitleData from '../src/data/book-titles';
import buyprintData from '../src/data/buyprint';
import errataData from '../src/data/errata';
import errataBookData from '../src/data/errata-book';
import errata7199 from '../src/data/errata-7199';
import errataSummary from '../src/data/errata-summary';
import errataResources from '../src/data/errata-resources';
import footerData from '../src/data/footer';
import institutionalPartnershipData from '../src/data/institutional-partnership';
import openstaxHomepageData from '../src/data/openstax-homepage';
import osNewsData from '../src/data/openstax-news-detail';
import osTutorData from '../src/data/openstax-tutor';
import pageData from '../src/data/partners';
import polishData from '../src/data/details-polish';
import pressData from '../src/data/press';
import pressArticleData from '../src/data/press-article';
import printOrderData from '../src/data/print-order';
import researchData from '../src/data/research';
import rolesData from '../src/data/roles';
import salesforceData from '../src/data/salesforce';
import salesforcePartnerData from '../src/data/salesforce-partners';
import schoolsData from '../src/data/schools';
import stickyData from '../src/data/sticky';
import subjectData from '../src/data/subject-categories';
import teamData from '../src/data/team';
import userData from '../src/data/user';
import archiveData from '../src/data/archive';

global.fetch = jest.fn().mockImplementation((...args) => {
    const isAdoption = (/pages\/adoption-form/).test(args[0]);
    const isBiology = (/v2\/pages\/207/).test(args[0]);
    const isBlogArticle = (/blog-article/).test(args[0]);
    const isBooks = (/api\/books/).test(args[0]);
    const isBooksForAnalytics = (/book_student_resources/).test(args[0]);
    const isBookTitles = (/fields=title,id/).test(args[0]);
    const isBuyprint = args[0].includes('buyprint');
    const isErrata = (/pages\/errata\/$/).test(args[0]);
    const isErrataBook = (/errata\/\?book_title/).test(args[0]);
    const isErrata7199 = (/errata[?/]7199/).test(args[0]);
    const isErrataResources = (/errata-fields\?field/).test(args[0]);
    const isErrataSummary = args[0] === 'https://cms-dev.openstax.org/apps/cms/api/pages/errata?format=json';
    const isFooter = (/api\/footer/).test(args[0]);
    const isInstitutionalPartnership = (/pages\/institutional-partners/).test(args[0]);
    const isHomepage = (/openstax-homepage/).test(args[0]);
    const isOsNews = (/openstax-news/).test(args[0]);
    const isOsTutor = (/pages\/openstax-tutor/).test(args[0]);
    const isPartner = (/pages\/partners/).test(args[0]);
    const isPolishPhysics = (/fizyka/).test(args[0]);
    const isPress = (/api\/press\/?$/).test(args[0]);
    const isPressArticle = (/api\/press\/./).test(args[0]);
    const isPrintOrder = (/pages\/print-order/).test(args[0]);
    const isResearch = (/pages\/research/).test(args[0]);
    const isRoles = (/snippets\/roles/).test(args[0]);
    const isSchools = (/salesforce\/schools/).test(args[0]);
    const isSticky = (/api\/sticky/).test(args[0]);
    const isSubjects = (/snippets\/subjects/).test(args[0]);
    const isTeam = (/pages\/team/).test(args[0]);
    const isUser = (/api\/user/).test(args[0]);
    const isImage = (/api\/v2\/images/).test(args[0]);
    const isArchive = (/archive\.cnx/).test(args[0]);
    const isSalesforceForms = (/salesforce\/forms/).test(args[0]);
    const isSalesforcePartners = (/salesforce\/partners/).test(args[0]);

    return new Promise(
        function (resolve, reject) {
            let payload = {};

            if (isAdoption) {
                payload = adoptionFormData;
            } else if (isPartner) {
                payload = pageData;
            } else if (isErrata) {
                payload = errataData;
            } else if (isErrataBook) {
                payload = errataBookData;
            } else if (isErrata7199) {
                payload = errata7199;
            } else if (isErrataResources) {
                payload = errataResources;
            } else if (isErrataSummary) {
                payload = errataSummary;
            } else if (isFooter) {
                payload = footerData;
            } else if (isHomepage) {
                payload = openstaxHomepageData;
            } else if (isInstitutionalPartnership) {
                payload = institutionalPartnershipData;
            } else if (isSubjects) {
                payload = subjectData;
            } else if (isBiology) {
                payload = biologyData;
            } else if (isPolishPhysics) {
                payload = polishData;
            } else if (isPress) {
                payload = pressData;
            } else if (isPressArticle) {
                payload = pressArticleData;
            } else if (isPrintOrder) {
                payload = printOrderData;
            } else if (isBookTitles) {
                payload = bookTitleData;
            } else if (isOsNews) {
                payload = osNewsData;
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
            } else if (isUser) {
                payload = userData;
            } else if (isArchive) {
                payload = archiveData;
            } else if (isBooks) {
                payload = booksData;
            } else if (isBuyprint) {
                payload = buyprintData;
            } else if (isSalesforceForms) {
                payload = salesforceData;
            } else if (isSalesforcePartners) {
                payload = salesforcePartnerData;
            } else if (isImage) {
                // ignore
            } else {
                console.warn("rejecting", args);
            }
            resolve({
                ok: true,
                json() {
                    return Promise.resolve(payload);
                }
            })
        }
    );
});

window.ga = () => {};
