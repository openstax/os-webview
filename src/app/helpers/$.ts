const isPolish = (titleOrSlug: string) => (/fizyka|psychologia|podstawy/i).test(titleOrSlug);
const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const apiOriginAndPrefix = `${process.env.API_ORIGIN}/apps/cms/api/v2`;
const apiOriginAndOldPrefix = apiOriginAndPrefix.replace('/v2', '');

const spaceForMenu = 59;

function scrollTo(el: Element, offset = 0) {
    const getOffsetTop = () => {
        const rect = el.getBoundingClientRect();

        return rect.top - spaceForMenu - offset;
    };

    window.scrollBy({
        top: getOffsetTop(),
        behavior: 'smooth'
    });
}

export default {
    isPolish,
    focusable,
    apiOriginAndPrefix,
    apiOriginAndOldPrefix,
    scrollTo
} as const;
