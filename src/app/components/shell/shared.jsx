import React, {useState, useEffect} from 'react';
import cmsFetch from '~/models/cmsFetch';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './shared.scss';

// Shim for incognito windows that disable localStorage
if (!window.localStorage) {
    window.localStorage = {
        getItem(key) {return window.localStorage[key];}
    };
}

export function useSeenCounter(seenEnough) {
    const [counter, setCounter] = useState(window.localStorage?.visitedGive || 0);
    const hasBeenSeenEnough = React.useMemo(
        () => counter > seenEnough,
        [counter, seenEnough]
    )
    const increment = React.useCallback(
        () => setCounter(counter + 1),
        [counter]
    );

    useEffect(
        () => {
            try {
                window.localStorage.visitedGive = counter;
            } catch {
                console.warn('LocalStorage restricted');
            }
        },
        [counter]
    );

    return [hasBeenSeenEnough, increment];
}

export function PutAway({onClick}) {
    return (
        <div className="put-away" role="button" onClick={onClick}>
            &times;
        </div>
    );
}

export function usePutAway() {
    const [closed, setClosed] = useState(false);

    return [closed, () => <PutAway onClick={() => setClosed(true)} />];
}

// eslint-disable-next-line complexity
function getMode(stickyData) {
    if (!stickyData) {
        return null;
    }

    const expireDate = new Date(stickyData.emergency_expires);
    const useEmergency = stickyData.emergency_expires && Date.now() < expireDate;

    if (useEmergency) {
        return 'emergency';
    }

    const startDate = new Date(stickyData.start);
    const endDate = new Date(stickyData.expires);
    const microdonationActive = startDate < Date.now() && endDate > Date.now();

    if (!microdonationActive) {
        return null;
    }

    return (stickyData.show_popup ? 'popup' : 'banner');
}

function useCampaign(stickyData) {
    const {start} = (stickyData || {});
    const mode = getMode(stickyData);

    useEffect(() => {
        if (mode && window.localStorage) {
            const campaignId = `${mode}-${start}`;
            const savedId = window.localStorage.campaignId;

            if (savedId !== campaignId) {
                window.localStorage.campaignId = campaignId;
                window.localStorage.visitedGive = 0;
            }
        }
    }, [start, mode]);
}

const stickyDataPromise = Promise.all([cmsFetch('sticky/'), cmsFetch('snippets/givebanner')])
    .then(([sd, bd]) => {
        sd.bannerInfo = bd[0];
        return sd;
    });

// eslint-disable-next-line complexity
export function useStickyData() {
    const stickyData = useDataFromPromise(stickyDataPromise);

    useCampaign(stickyData);

    if (!stickyData) {
        return null;
    }

    const mode = getMode(stickyData);

    return {mode, ...stickyData};
}
