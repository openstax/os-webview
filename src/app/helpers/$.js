const $ = {};

$.isPolish = (titleOrSlug) => (/fizyka|psychologia|podstawy/i).test(titleOrSlug);

$.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

$.apiOriginAndPrefix = `${process.env.API_ORIGIN}/apps/cms/api/v2`;
$.apiOriginAndOldPrefix = $.apiOriginAndPrefix.replace('/v2', '');

const spaceForMenu = 59;

$.scrollTo = (el, offset = 0) => {
    const getOffsetTop = () => {
        const rect = el.getBoundingClientRect();

        return rect.top - spaceForMenu - offset;
    };

    window.scrollBy({
        top: getOffsetTop(),
        behavior: 'smooth'
    });
};

export default $;
