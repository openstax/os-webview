import React from 'react';
import {useLocation} from 'react-router-dom';
import {enroll} from '@openstax/experiments';
import {useDataFromSlug} from '~/helpers/page-data-utils';

export type Placement = 'pdf' | 'instructor_resources' | 'student_resources' | 'other';

type DonationLinkRow = {
    placement: Placement;
    variant: string;
    url: string;
    header_subtitle: string;
    give_link_text: string;
    is_active: boolean;
};

export type GiveLink = {
    url: string;
    headerSubtitle: string;
    giveLinkText: string;
};

// Links like `/details/${slug}?Instructor resources` (see book-tile/dropdown-menu.tsx) carry
// the intended placement as a query-string key rather than a value.
// give-before-other renders as soon as the dialog opens, and useDonationPopupData yields {}
// until its request settles, so without a floor the Give anchor can have no href at all.
const FALLBACK_POPUP_GIVE_LINK = 'https://riceconnect.rice.edu/donation/support-openstax-subject';

const placementByVariant: {[variant: string]: Placement} = {
    'Instructor resource': 'instructor_resources',
    'Student resource': 'student_resources'
};

// Flex-page resource links carry the kind as a prop instead of the details-page query key
// (see flex-page/blocks/TableResourceCell.tsx), so it is the only placement signal there.
export function placementForVariant(variant?: string): Placement {
    return (variant && placementByVariant[variant]) || 'other';
}

export function placementFromSearch(search: string): Placement | null {
    const keys = Array.from(new URLSearchParams(search).keys()).map((k) => k.toLowerCase());

    if (keys.includes('instructor resources')) {
        return 'instructor_resources';
    }
    if (keys.includes('student resources')) {
        return 'student_resources';
    }
    return null;
}

function chooseRow(rows: DonationLinkRow[]): DonationLinkRow | null {
    if (rows.length === 0) {
        return null;
    }
    if (rows.length === 1) {
        return rows[0];
    }

    const variants = rows.map((row) => ({...row, name: row.variant}));

    return enroll({name: 'Donation Popup Link', variants});
}

export default function useGiveLink(defaultPlacement: Placement): GiveLink | null {
    const {search} = useLocation();
    const rows = useDataFromSlug<DonationLinkRow[]>('donations/donation-links');
    const placement = React.useMemo(
        () => placementFromSearch(search) ?? defaultPlacement,
        [search, defaultPlacement]
    );

    return React.useMemo(() => {
        if (!(rows instanceof Array)) {
            return null;
        }

        const activeRows = rows.filter((row) => row.is_active && row.placement === placement);
        const chosen = chooseRow(activeRows);

        if (!chosen) {
            return null;
        }

        return {url: chosen.url, headerSubtitle: chosen.header_subtitle, giveLinkText: chosen.give_link_text};
    }, [rows, placement]);
}

type FallbackData = {
    give_link: string;
    header_subtitle: string;
    give_link_text: string;
};

const noGiveLink: GiveLink = {url: '', headerSubtitle: '', giveLinkText: ''};

function resolveGiveLink(giveLink: GiveLink | null, data: FallbackData) {
    const {url, headerSubtitle, giveLinkText} = giveLink ?? noGiveLink;

    return {
        url: url || data.give_link || FALLBACK_POPUP_GIVE_LINK,
        headerSubtitle: headerSubtitle || data.header_subtitle,
        giveLinkText: giveLinkText || data.give_link_text
    };
}

// Callers render before the CMS request settles (and must still show a working Give
// button if it fails), so the popup's own give_link/header_subtitle/give_link_text are
// the floor. A blank string on the chosen row (unset variant override) falls back too.
export function useResolvedGiveLink(defaultPlacement: Placement, data: FallbackData) {
    return resolveGiveLink(useGiveLink(defaultPlacement), data);
}
