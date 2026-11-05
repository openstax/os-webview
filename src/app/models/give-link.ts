type GiveLinkFields = {
    showButton?: boolean;
    default_give_link?: string;
    give_link?: string;
};

// Both headers paint before the give-today request settles and have to keep working through a
// CMS outage, so this needs a value that exists at build time. Any CMS value takes precedence.
const FALLBACK_GIVE_LINK = 'https://riceconnect.rice.edu/donation/support-openstax-header';

// The campaign link takes over inside the Give Today menu window; outside it, the evergreen
// default. A campaign left with a blank link falls through rather than rendering a dead CTA.
export default function headerGiveLink(giveData: GiveLinkFields) {
    if (giveData.showButton && giveData.give_link) {
        return giveData.give_link;
    }

    return giveData.default_give_link || giveData.give_link || FALLBACK_GIVE_LINK;
}
