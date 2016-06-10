const EXTERNAL = /^((f|ht)tps?:)?\/\//;
const MAILTO = /^mailto:(.+)/;
const PDF = /.pdf$/;

function findAncestor(el, Element) {
    let parent = el;

    while (parent && !(parent instanceof Element)) {
        parent = parent.parentNode;
    }

    return parent;
}

function ignoreUrl(url) {
    return typeof url !== 'string' || url.charAt(0) === '#' || MAILTO.test(url);
}

function ignoreClick(e) {
    return e.defaultPrevented || e.metaKey || e.which !== 1;
}

function validUrlClick(e) {
    let el = findAncestor(e.target, HTMLAnchorElement) || e.target;
    let href = el.getAttribute('href');

    if (ignoreClick(e) || ignoreUrl(href)) {
        return false;
    }

    return el;
}

function isPDF(url) {
    return PDF.test(url);
}

function isExternal(href) {
    return EXTERNAL.test(href);
}

export default {
    isExternal: isExternal,
    validUrlClick: validUrlClick,
    isPDF: isPDF
};
