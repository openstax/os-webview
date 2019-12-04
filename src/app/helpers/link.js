import settings from 'settings';

const EXTERNAL = /^((f|ht)tps?:)?\/\//;
const ABSOLUTE_OPENSTAX = new RegExp(
    `(?:https?://openstax.org|${window.location.origin})(?!/(?:books|accounts|give|oxauth|blog-feed)/)`
);
const MAILTO = /^mailto:(.+)/;
const PDF = /.pdf$/;
const ZIP = /.zip$/;
const TXT = /.txt$/;
const CNX = /cnx.org/;
const REX = /openstax.org\/books/;
const CLOUDFRONT = /cloudfront.net/;
const AMAZON = /amazon.com/;

function findAncestor(el, Element) {
    let parent = el;

    while (parent && !(parent instanceof Element)) {
        parent = parent.parentNode;
    }

    return parent;
}

function ignoreUrl(url) {
    return typeof url !== 'string' || MAILTO.test(url);
}

function ignoreClick(e) {
    return e.defaultPrevented || e.metaKey;
}

function validUrlClick(e) {
    const el = findAncestor(e.target, HTMLAnchorElement) || e.target;
    const href = el.getAttribute('href');

    if (ignoreClick(e) || ignoreUrl(href)) {
        return false;
    }

    return el;
}

function isTOCLink(el) {
    const isDetailsPage = (/^\/details/).test(window.location.pathname);
    const tocEl = document.querySelector('.table-of-contents');

    return tocEl && tocEl.contains(el);
}

function isPDF(url) {
    return PDF.test(url);
}

function isZIP(url) {
    return ZIP.test(url);
}

function isTXT(url) {
    return TXT.test(url);
}

function stripOpenStaxDomain(href) {
    return href.replace(ABSOLUTE_OPENSTAX, '');
}

function isExternal(href) {
    return EXTERNAL.test(href) && !ABSOLUTE_OPENSTAX.test(href);
}

function isCNX(href) {
    return CNX.test(href);
}

function isREX(href) {
    return REX.test(href);
}

function isAmazon(href) {
    return AMAZON.test(href);
}

function isCloudFront(href) {
    return CLOUDFRONT.test(href);
}


function loginOrOutLink(loginOrLogout) {
    const encodedLocation = encodeURIComponent(decodeURIComponent(window.location.href));

    return `${settings.apiOrigin}/oxauth/${loginOrLogout}/?next=${encodedLocation}`;
}

function loginLink() {
    return loginOrOutLink('login');
}

function logoutLink() {
    return loginOrOutLink('logout');
}

export default {
    isExternal,
    validUrlClick,
    isTOCLink,
    isPDF,
    isZIP,
    isTXT,
    isCNX,
    isREX,
    isCloudFront,
    isAmazon,
    loginLink,
    logoutLink,
    stripOpenStaxDomain
};
