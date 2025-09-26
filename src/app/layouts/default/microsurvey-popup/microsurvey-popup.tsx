import React from 'react';
import {PutAway} from '../shared';
import useMSQueue from './queue';
import useSharedDataContext from '~/contexts/shared-data';
import './microsurvey-popup.scss';

export default function MicroSurvey() {
    const [QueuedItem, nextItem] = useMSQueue();
    const bottom = useBottom();
    const style = React.useMemo(() => (bottom ? {bottom} : {}), [bottom]);

    if (!QueuedItem) {
        return null;
    }

    return (
        <div id='microsurvey' style={style}>
            <QueuedItem>
                <PutAway onClick={nextItem} />
            </QueuedItem>
        </div>
    );
}

const SF_DURATION = 200; // sticky-footer animation duration

function useBottom() {
    const [value, setValue] = React.useState<number | null>(0);
    const {
        stickyFooterState: [sfs]
    } = useSharedDataContext();

    React.useEffect(() => {
        if (sfs === null) {
            setValue(null);
        }
        const sf = document.querySelector('.sticky-footer');

        if (sf) {
            window.setTimeout(() => {
                const {top} = sf.getBoundingClientRect();

                setValue(window.innerHeight - top + 15);
            }, SF_DURATION);
        }
    }, [sfs]);

    return value;
}
