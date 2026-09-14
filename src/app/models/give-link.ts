type GiveLinkFields = {
    default_give_link?: string;
    give_link?: string;
};

// Both headers paint before the give-today request settles and have to keep working through a
// CMS outage, so this needs a value that exists at build time. Any CMS value takes precedence.
const FALLBACK_GIVE_LINK = 'https://riceconnect.rice.edu/donation/support-openstax-header';

export default function headerGiveLink(giveData: GiveLinkFields) {
    return giveData.default_give_link || giveData.give_link || FALLBACK_GIVE_LINK;
}
