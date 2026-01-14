import type {WindowWithSettings} from './window-settings';

const EXTERNAL = /^([a-z]+:)/;
const ABSOLUTE_OPENSTAX = new RegExp(
    `(?:https?://openstax.org|${window.location.origin})(?!/(?:(?:.*/)?books|accounts|oxauth|blog-feed|documents)/)`
);
const MAILTO = /^mailto:(.+)/;

function ignoreUrl(url: string | null) {
    return typeof url !== 'string' || MAILTO.test(url);
}

function ignoreClick(e: React.MouseEvent) {
    return e.defaultPrevented || e.metaKey;
}

function validUrlClick(e: React.MouseEvent) {
    const el = (e.target as HTMLElement).closest('a');
    const href = el?.getAttribute('href') ?? null;

    if (ignoreClick(e) || ignoreUrl(href)) {
        return false;
    }

    return el;
}

function stripOpenStaxDomain(href: string) {
    return href.replace(ABSOLUTE_OPENSTAX, '');
}

function isExternal(href: string) {
    return EXTERNAL.test(href) && !ABSOLUTE_OPENSTAX.test(href);
}

function loginOrOutLink(loginOrLogout: 'login' | 'logout') {
    const encodedLocation = encodeURIComponent(
        decodeURIComponent(window.location.href)
    );
    const {accountHref} = (window as WindowWithSettings).SETTINGS;

    return `${accountHref}/${loginOrLogout}/?r=${encodedLocation}`;
}

function loginLink() {
    return loginOrOutLink('login');
}

function logoutLink() {
    return loginOrOutLink('logout');
}

function setUtmCampaign(url: string, campaign: string) {
    try {
        const parsed = new URL(url);
        parsed.searchParams.set('utm_campaign', campaign);

        return parsed.toString();
    } catch {
        return url;
    }
}

export default {
    isExternal,
    validUrlClick,
    loginLink,
    logoutLink,
    stripOpenStaxDomain,
    setUtmCampaign
};
