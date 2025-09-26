import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {Countdown, Amount, GiveButton, BoxData, TakeoverData} from './common';
import './content-mobile.scss';

function HeadlineImage({headline, image}: {headline: string; image: string}) {
    return (
        <div className="headline-image" style={{backgroundImage: `url(${image})`}}>
            <div className="gradient" />
            <RawHTML Tag="h1" html={headline} />
        </div>
    );
}

function MessageBox({buttonText, buttonUrl, headline, html, message}: {
    buttonText: string;
    buttonUrl: string;
    headline: string;
    html: string;
    message: string;
}) {
    return (
        <React.Fragment>
            <div className="blue-section">
                <GiveButton text={buttonText} url={buttonUrl} />
                <h2>{headline} </h2>
                <RawHTML html={html} />
            </div>
            <div className="white-section">{message}</div>
        </React.Fragment>
    );
}

function GoalBox({buttonText, buttonUrl, goalAmount, goalTime, message}: {
    buttonText: string;
    buttonUrl: string;
    goalAmount: number;
    goalTime: string;
    message: string;
}) {
    return (
        <div className="goal-info">
            <GiveButton text={buttonText} url={buttonUrl} />
            <Countdown goalTime={goalTime} />
            <Amount amount={goalAmount} />
            <div className="white-section">{message}</div>
        </div>
    );
}

function Box({data}: {data: BoxData}) {
    const boxComponents: Record<string, React.ReactNode> = {
        message: <MessageBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            headline={data.boxHeadline!} html={data.boxHtml!}
            message={data.message}
        />,
        goal: <GoalBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            goalAmount={data.goalAmount!} goalTime={data.goalTime!}
            message={data.message}
        />
    };

    return boxComponents[data.messageType] || <h1>OOPS, {data.messageType}</h1>;
}

export default function MobileContent({data}: {data: TakeoverData}) {
    React.useEffect(() => {
        document.getElementById('header')?.classList.add('over-mobile-dialog');

        return () => document.getElementById('header')?.classList.remove('over-mobile-dialog');
    }, []);

    return (
        <div className="takeover-content mobile-only">
            <HeadlineImage headline={data.headline} image={data.image} />
            <Box data={data} />
        </div>
    );
}
