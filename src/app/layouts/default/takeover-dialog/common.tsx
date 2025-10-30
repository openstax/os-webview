import React from 'react';
import useTakeoverContext from './takeover-context';
import './common.scss';

const msPerSec = 1000;
const msPerMin = msPerSec * 60;
const msPerHour = msPerMin * 60;

function getHMS(goalTimeMs: number) {
    const msDiff = goalTimeMs - Date.now();

    return {
        h: Math.floor(msDiff / msPerHour),
        m: Math.floor((msDiff % msPerHour) / msPerMin),
        s: Math.floor((msDiff % msPerMin) / msPerSec)
    };
}

function useHMS(goalTime: string) {
    const goalTimeMs = new Date(goalTime).getTime();
    const [hms, setHms] = React.useState(getHMS(goalTimeMs));

    React.useEffect(() => {
        const i = window.setInterval(
            () => setHms(getHMS(goalTimeMs)),
            msPerSec
        );

        return () => window.clearInterval(i);
    }, [goalTimeMs]);

    return (hms);
}

export function Countdown({goalTime}: {goalTime: string}) {
    const {h, m, s} = useHMS(goalTime);

    return (
        <div className="countdown-numbers">
            <div><span className="number">{h}</span> hours</div>
            <div><span className="number">{m}</span> minutes</div>
            <div><span className="number">{s}</span> seconds</div>
        </div>
    );
}


const numFormat = window.Intl.NumberFormat('en-US').format; // eslint-disable-line new-cap

export function Amount({amount}: {amount: number}) {
    return (
        <div className="amount-box">
            <div className="message">our goal is to raise</div>
            <div className="amount">${numFormat(amount)}</div>
        </div>
    );
}

export function GiveButton({text, url}: {text: string; url: string}) {
    const {close} = useTakeoverContext();

    return (
        <a className="btn primary" href={url} onClick={close}>{text}</a>
    );
}
