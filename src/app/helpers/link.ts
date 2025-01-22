import windowWithSettings from './window-settings';

const EXTERNAL = /^([a-z]+:)/;
const ABSOLUTE_OPENSTAX = new RegExp(
    `(?:https?://openstax.org|${window.location.origin})(?!/(?:books|accounts|oxauth|blog-feed|documents)/)`
);
const MAILTO = /^mailto:(.+)/;
const CNX = /cnx.org/;
const REX = /openstax.org\/books/;
const CLOUDFRONT = /cloudfront.net/;
const AMAZON = /amazon.com/;

function findAncestor(el: HTMLElement) {
    let parent: ParentNode | null = el;

    while (parent && !(parent instanceof window.HTMLAnchorElement)) {
        parent = parent.parentNode;
    }

    return parent;
}

function ignoreUrl(url: string | null) {
    return typeof url !== 'string' || MAILTO.test(url);
}

function ignoreClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    return e.defaultPrevented || e.metaKey;
}

function validUrlClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const target = e.target as HTMLAnchorElement;
    const el = findAncestor(target) || target;
    const href = el.getAttribute('href');

    if (ignoreClick(e) || ignoreUrl(href)) {
        return false;
    }

    return el;
}

function isTOCLink(el: Node) {
    const tocEl = document.querySelector('.table-of-contents');

    return tocEl && tocEl.contains(el);
}

function stripOpenStaxDomain(href: string) {
    return href.replace(ABSOLUTE_OPENSTAX, '');
}

function isExternal(href: string) {
    return EXTERNAL.test(href) && !ABSOLUTE_OPENSTAX.test(href);
}

function isCNX(href: string) {
    return CNX.test(href);
}

function isREX(href: string) {
    return REX.test(href);
}

function isAmazon(href: string) {
    return AMAZON.test(href);
}

function isCloudFront(href: string) {
    return CLOUDFRONT.test(href);
}

function loginOrOutLink(loginOrLogout: 'login' | 'logout') {
    const encodedLocation = encodeURIComponent(
        decodeURIComponent(window.location.href)
    );

    return `${windowWithSettings.SETTINGS.accountHref}/${loginOrLogout}/?r=${encodedLocation}`;
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
    isCNX,
    isREX,
    isCloudFront,
    isAmazon,
    loginLink,
    logoutLink,
    stripOpenStaxDomain
};
