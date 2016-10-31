const EXTERNAL = /^((f|ht)tps?:)?\/\//;
const MAILTO = /^mailto:(.+)/;
const PDF = /.pdf$/;
const ZIP = /.zip$/;
const TXT = /.txt$/;
const CNX = /cnx.org/;
const CLOUDFRONT = /cloudfront.net/;

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

function isPDF(url) {
    return PDF.test(url);
}

function isZIP(url) {
    return ZIP.test(url);
}

function isTXT(url) {
    return TXT.test(url);
}

function isExternal(href) {
    return EXTERNAL.test(href);
}

function isCNX(href) {
    return CNX.test(href);
}

function isCloudFront(href) {
    return CLOUDFRONT.test(href);
}

export default {
    isExternal,
    validUrlClick,
    isPDF,
    isZIP,
    isTXT,
    isCNX,
    isCloudFront
};
