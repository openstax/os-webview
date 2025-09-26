import React, {useState, useEffect} from 'react';
import cmsFetch from '~/helpers/cms-fetch';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import PutAway from '~/components/put-away/put-away';
import './shared.scss';

type BannerInfo = {
    id: number;
    heading: string;
    body: string;
    link_text: string;
    link_url: string;
};

type StickyDataRaw = {
    start: string;
    expires: string;
    emergency_expires?: string;
    show_popup: boolean;
};

type StickyDataWithBanner = StickyDataRaw & {
    bannerInfo: BannerInfo;
    mode: 'emergency' | 'popup' | 'banner' | null;
};

// Shim for incognito windows that disable localStorage
if (!window.localStorage) {
    window.localStorage = {
        getItem(key: string) {return window.localStorage[key];},
        setItem() {},
        removeItem() {},
        clear() {},
        key() {return null;},
        length: 0
    };
}

export function useSeenCounter(seenEnough: number): [boolean, () => void] {
    const [counter, increment] = React.useReducer(
        (s: number) => s + 1,
        Number(window.localStorage?.visitedGive) || 0
    );
    const hasBeenSeenEnough = React.useMemo(
        () => counter > seenEnough,
        [counter, seenEnough]
    );

    useEffect(
        () => {
            try {
                window.localStorage.visitedGive = String(counter);
            } catch {
                console.warn('LocalStorage restricted');
            }
        },
        [counter]
    );

    return [hasBeenSeenEnough, increment];
}

export {PutAway};

export function usePutAway(): [boolean, () => JSX.Element] {
    const [closed, setClosed] = useState(false);

    return [closed, () => <PutAway onClick={() => setClosed(true)} />];
}

// eslint-disable-next-line complexity
function getMode(stickyData: StickyDataRaw | null): 'emergency' | 'popup' | 'banner' | null {
    if (!stickyData) {
        return null;
    }

    const expireDate = new Date(stickyData.emergency_expires || '');
    const useEmergency = stickyData.emergency_expires && Date.now() < expireDate.getTime();

    if (useEmergency) {
        return 'emergency';
    }

    const startDate = new Date(stickyData.start);
    const endDate = new Date(stickyData.expires);
    const microdonationActive = startDate.getTime() < Date.now() && endDate.getTime() > Date.now();

    if (!microdonationActive) {
        return null;
    }

    return (stickyData.show_popup ? 'popup' : 'banner');
}

function useCampaign(stickyData: StickyDataRaw | null) {
    const {start} = (stickyData || {});
    const mode = getMode(stickyData);

    useEffect(() => {
        if (mode && window.localStorage) {
            const campaignId = `${mode}-${start}`;
            const savedId = window.localStorage.campaignId;

            if (savedId !== campaignId) {
                window.localStorage.campaignId = campaignId;
                window.localStorage.visitedGive = '0';
            }
        }
    }, [start, mode]);
}

export function useStickyData(): StickyDataWithBanner | null {
    const stickyDataPromise = React.useMemo(
        () => Promise.all([cmsFetch('sticky/'), cmsFetch('snippets/givebanner')])
        .then(([sd, bd]: [StickyDataRaw, BannerInfo[]]) => ({
            ...sd,
            bannerInfo: bd[0]
        })),
        []
    );
    const stickyData = useDataFromPromise(stickyDataPromise) ?? null;

    useCampaign(stickyData);

    const mode = getMode(stickyData);

    return React.useMemo(
        () => stickyData ? ({mode, ...stickyData}) : null,
        [mode, stickyData]
    );
}
