import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import {enroll} from '@openstax/experiments';
import cmsFetch from '~/helpers/cms-fetch';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import PutAway from '~/components/put-away/put-away';
import './shared.scss';

export type BannerInfo = {
    id: number;
    name: string;
    html_message: string;
    link_text: string | null;
    link_url: string | null;
    banner_thumbnail?: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    context_filter: string;
    url_pattern: string | null;
};

type EmergencyDataRaw = {
    emergency_expires: string | null;
    emergency_content: string;
};

export type BannerDataWithEmergency = EmergencyDataRaw & {
    bannerConfigs: BannerInfo[];
    mode: 'emergency' | 'banner' | null;
};

export {PutAway};

export function usePutAway(): [boolean, () => JSX.Element] {
    const [closed, setClosed] = useState(false);

    return [closed, () => <PutAway onClick={() => setClosed(true)} />];
}

// eslint-disable-next-line complexity
function getMode(
    bannerData: (EmergencyDataRaw & {bannerConfigs: BannerInfo[]}) | null
): 'emergency' | 'banner' | null {
    if (!bannerData) {
        return null;
    }

    const expireDate = new Date(bannerData.emergency_expires ?? 0);
    const useEmergency =
        bannerData.emergency_expires && Date.now() < expireDate.getTime();

    if (useEmergency) {
        return 'emergency';
    }

    if (bannerData.bannerConfigs?.length > 0) {
        return 'banner';
    }

    return null;
}

export function useBannerData(): BannerDataWithEmergency | null {
    const bannerDataPromise = React.useMemo(
        () => Promise.all([
            cmsFetch('emergency/'),
            cmsFetch('donations/sitebanner/')
        ])
        .then(([ed, bannerConfigs]: [EmergencyDataRaw, BannerInfo[]]) => ({
            ...ed,
            bannerConfigs
        })),
        []
    );
    const bannerData = useDataFromPromise(bannerDataPromise) ?? null;
    const mode = getMode(bannerData);

    return React.useMemo(
        () => bannerData ? ({mode, ...bannerData}) : null,
        [mode, bannerData]
    );
}

/* eslint-disable camelcase */
const contextMatchers: Record<string, (pathname: string) => boolean> = {
    all: () => true,
    subjects: (p) => p.startsWith('/subjects'),
    book_details: (p) => p.startsWith('/details/books/'),
    blog: (p) => p.startsWith('/blog')
};
/* eslint-enable camelcase */

function bannerMatchesPath(banner: BannerInfo, pathname: string): boolean {
    if (banner.context_filter === 'url_pattern') {
        const pattern = banner.url_pattern;

        return Boolean(pattern) && (pathname === pattern || pathname.startsWith(pattern as string));
    }
    return contextMatchers[banner.context_filter]?.(pathname) ?? false;
}

export function useFilteredBanners(
    bannerConfigs: BannerInfo[] | null | undefined
): BannerInfo[] {
    const {pathname} = useLocation();

    return React.useMemo(() => {
        if (!bannerConfigs?.length) {
            return [];
        }

        return bannerConfigs.filter((banner) => bannerMatchesPath(banner, pathname));
    }, [bannerConfigs, pathname]);
}

export function useSelectedBanner(
    filteredBanners: BannerInfo[]
): BannerInfo | null {
    return React.useMemo(() => {
        if (!filteredBanners.length) {
            return null;
        }

        if (filteredBanners.length === 1) {
            return filteredBanners[0];
        }

        const variants = filteredBanners.map((banner) => ({
            name: banner.name,
            banner
        }));

        return enroll({
            name: 'Site Banner Campaign',
            variants
        }).banner;
    }, [filteredBanners]);
}
