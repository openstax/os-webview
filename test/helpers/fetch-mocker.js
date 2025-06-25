import adoptionFormData from '../src/data/adoption-form';
import allBooksData from '../src/data/all-books';
import amazonBlurb from '../src/data/amazon-blurb';
import algebraData from '../src/data/details-college-algebra';
import biologyData from '../src/data/details-biology-2e';
import blogArticleData from '../src/data/blog-article';
import blogCollection from '../src/data/blogcollection';
import blogMoreStories from '../src/data/blog-more';
import blogPinned from '../src/data/blog-pinned';
import booksData from '../src/data/books';
import booksForAnalyticsData from '../src/data/books-for-analytics';
import bookTitleData from '../src/data/book-titles';
import buyprintData from '../src/data/buyprint';
import donationPopupData from '../src/data/donation-popup';
import errataData from '../src/data/errata';
import errataBookData from '../src/data/errata-book';
import errata7199 from '../src/data/errata-7199';
import errataSummary from '../src/data/errata-summary';
import errataResources from '../src/data/errata-resources';
import faq from '../src/data/faq';
import flags from '../src/data/flags';
import footerData from '../src/data/footer';
import formHeadings from '../src/data/form-headings';
import impact from '../src/data/impact';
import institutionalPartnershipData from '../src/data/institutional-partnership';
import kineticData from '../src/data/kinetic';
import newSubjectsData from '../src/data/new-subjects';
import openstaxHomepageData from '../src/data/openstax-homepage';
import osNewsData from '../src/data/openstax-news-detail';
import pageData from '../src/data/partners';
import polishData from '../src/data/details-polish';
import pressData from '../src/data/press';
import pressArticleData from '../src/data/press-article';
import researchData from '../src/data/research';
import renewalData from '../src/data/renewal';
import rolesData from '../src/data/roles';
import salesforceData from '../src/data/salesforce';
import salesforcePartnerData from '../src/data/salesforce-partners';
import schoolsData from '../src/data/schools';
import searchCollection from '../src/data/search-collection';
import searchSubject from '../src/data/search-subject';
import sfapiUser from '../src/data/sfapi-user';
import sfapiLists from '../src/data/sfapi-lists';
import sfapiSchoolTrinity from '../src/data/sfapi-school-trinity';
import subjectData from '../src/data/subject-categories';
import subjectPageData from '../src/data/subject-page';
import teamData from '../src/data/team';
import userData from '../src/data/user';
import archiveData from '../src/data/archive';

// eslint-disable-next-line no-undef
global.fetch = jest.fn().mockImplementation((...args) => {
    const isAdoption = (/pages\/adoption-form/).test(args[0]);
    const isAlgebra = (/v2\/pages\/39/).test(args[0]);
    const isAllBooks = (/book_subjects/).test(args[0]);
    const isAmazonBlurb = args[0].endsWith('snippets/amazonbookblurb/');
    const isBiology = (/v2\/pages\/207/).test(args[0]);
    const isBlogPinned = (/pin_to_top=true/).test(args[0]);
    const isBlogMoreStories = (/pin_to_top=false/).test(args[0]);
    const isBlogArticle = (/blog-article/).test(args[0]);
    const isBlogCollection = args[0].includes('blogcollection');
    const isBooks = (/api\/books/).test(args[0]);
    const isBooksForAnalytics = (/book_student_resources/).test(args[0]);
    const isBookTitles = (/fields=title,id/).test(args[0]);
    const isBuyprint = args[0].includes('buyprint');
    const isDonationPopup = args[0].includes('donation-popup');
    const isErrata = (/pages\/errata\//).test(args[0]);
    const isErrataBook = (/errata\/\?book_title/).test(args[0]);
    const isErrata7199 = (/errata[?/]7199/).test(args[0]);
    const isErrataResources = (/errata-fields\?field/).test(args[0]);
    const isErrataSummary = args[0] === 'https://cms-dev.openstax.org/apps/cms/api/pages/errata?format=json';
    const isFaq = args[0].includes('/pages/faq');
    const isFlags = args[0].includes('/flags');
    const isFooter = (/api\/footer/).test(args[0]);
    const isFormHeading = (/form-headings/).test(args[0]);
    const isGiveBanner = args[0].endsWith('snippets/givebanner/');
    const isImpact = args[0].includes('/pages/impact');
    const isInstitutionalPartnership = (/pages\/institutional-partners/).test(args[0]);
    const isKinetic = args[0].endsWith('kinetic/');
    const isHomepage = (/openstax-homepage/).test(args[0]);
    const isImage = args[0].includes('/api/images/');
    const isNewSubjects = args[0].includes('new-subjects');
    const isOsNews = (/openstax-news/).test(args[0]);
    const isOxMenus = args[0].includes('/oxmenus/');
    const isPartner = (/pages\/partners/).test(args[0]);
    const isPolishPhysics = (/fizyka/).test(args[0]);
    const isPress = (/api\/press\/\?/).test(args[0]);
    const isPressArticle = (/api\/press\/[a-z]/).test(args[0]);
    const isRenewal = args[0].includes('renewal?account_uuid');
    const isResearch = args[0].includes('pages/research');
    const isRoles = (/snippets\/roles/).test(args[0]);
    const isSchools = (/salesforce\/schools/).test(args[0]);
    const isSearchCollection = args[0].includes('/search/?collection=');
    const isSearchSubject = args[0].includes('/search/?subjects=');
    const isSfapiUser = (/api\/v1\/users/).test(args[0]);
    const isSfapiLists = (/api\/v1\/lists/).test(args[0]);
    const isSfapiSchoolTrinity = (/0017h00000YXEBzAAP/).test(args[0]);
    const isSubjects = (/snippets\/subjects/).test(args[0]);
    const isSubjectPage = args[0].includes('pages/subjects');
    const isTeam = (/pages\/team/).test(args[0]);
    const isUser = (/api\/user/).test(args[0]);
    const isArchive = (/archive\.cnx/).test(args[0]);
    const isSalesforceForms = (/salesforce\/forms/).test(args[0]);
    const isSalesforcePartners = (/salesforce\/partners/).test(args[0]);

    return new Promise(
        // eslint-disable-next-line complexity
        (resolve) => {
            let payload = {};

            if (isAdoption) {
                payload = adoptionFormData;
            } else if (isAmazonBlurb) {
                payload = amazonBlurb;
            } else if (isAllBooks) {
                payload = allBooksData;
            } else if (isPartner) {
                payload = pageData;
            } else if (isBlogCollection) {
                payload = blogCollection;
            } else if (isBlogMoreStories) {
                payload = blogMoreStories;
            } else if (isBlogPinned) {
                payload = blogPinned;
            } else if (isDonationPopup) {
                payload = donationPopupData;
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
            } else if (isFaq) {
                payload = faq;
            } else if (isFlags) {
                payload = flags;
            } else if (isFooter) {
                payload = footerData;
            } else if (isFormHeading) {
                payload = formHeadings;
            } else if (isGiveBanner) {
                payload = {};
            } else if (isHomepage) {
                payload = openstaxHomepageData;
            } else if (isImpact) {
                payload = impact;
            } else if (isInstitutionalPartnership) {
                payload = institutionalPartnershipData;
            } else if (isKinetic) {
                payload = kineticData;
            } else if (isSubjects) {
                payload = subjectData;
            } else if (isSubjectPage) {
                payload = subjectPageData;
            } else if (isNewSubjects) {
                payload = newSubjectsData;
            } else if (isAlgebra) {
                payload = algebraData;
            } else if (isBiology) {
                payload = biologyData;
            } else if (isPolishPhysics) {
                payload = polishData;
            } else if (isPress) {
                payload = pressData;
            } else if (isPressArticle) {
                payload = pressArticleData;
            } else if (isBookTitles) {
                payload = bookTitleData;
            } else if (isOsNews) {
                payload = osNewsData;
            } else if (isOxMenus) {
                payload = [];
            } else if (isBlogArticle) {
                payload = blogArticleData;
            } else if (isTeam) {
                payload = teamData;
            } else if (isBooksForAnalytics) {
                payload = booksForAnalyticsData;
            } else if (isRenewal) {
                payload = renewalData;
            } else if (isRoles) {
                payload = rolesData;
            } else if (isSchools) {
                payload = schoolsData;
            } else if (isUser) {
                payload = userData;
            } else if (isArchive) {
                payload = archiveData;
            } else if (isBooks) {
                payload = booksData;
            } else if (isResearch) {
                payload = researchData;
            } else if (isBuyprint) {
                payload = buyprintData;
            } else if (isSalesforceForms) {
                payload = salesforceData;
            } else if (isSalesforcePartners) {
                payload = salesforcePartnerData;
            } else if (isSfapiUser) {
                payload = sfapiUser;
            } else if (isSearchCollection) {
                payload = searchCollection;
            } else if (isSearchSubject) {
                payload = searchSubject;
            } else if (isSfapiLists) {
                payload = sfapiLists;
            } else if (isSfapiSchoolTrinity) {
                payload = sfapiSchoolTrinity;
            } else if (isImage) {
                // ignore
            } else {
                console.warn(
                    '*************\n' +
                    `*** rejecting ${args[0]}\n` +
                    '*************'
                );
            }

            resolve({
                ok: true,
                json() {
                    return Promise.resolve(payload);
                },
                text() {
                    return Promise.resolve(payload);
                }
            });
        }
    );
});

window.ga = () => {};
