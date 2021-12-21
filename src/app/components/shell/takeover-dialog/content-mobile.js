import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Countdown, Amount, GiveButton} from './common';
import './content-mobile.scss';

function HeadlineImage({headline, image}) {
    return (
        <div className="headline-image" style={{backgroundImage: `url(${image})`}}>
            <div className="gradient" />
            <RawHTML Tag="h1" html={headline} />
        </div>
    );
}

function MessageBox({buttonText, buttonUrl, headline, html, message}) {
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

function GoalBox({buttonText, buttonUrl, goalAmount, goalTime, message}) {
    return (
        <div className="goal-info">
            <GiveButton text={buttonText} url={buttonUrl} />
            <Countdown goalTime={goalTime} />
            <Amount amount={goalAmount} />
            <div className="white-section">{message}</div>
        </div>
    );
}

function Box({data}) {
    return ({
        message: <MessageBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            headline={data.boxHeadline} html={data.boxHtml}
            message={data.message}
        />,
        goal: <GoalBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            goalAmount={data.goalAmount} goalTime={data.goalTime}
            message={data.message}
        />
    }[data.messageType] || <h1>OOPS, {data.messageType}</h1>);
}

export default function MobileContent({data}) {
    React.useEffect(() => {
        document.getElementById('header').classList.add('over-mobile-dialog');

        return () => document.getElementById('header').classList.remove('over-mobile-dialog');
    }, []);

    return (
        <div className="takeover-content mobile-only">
            <HeadlineImage headline={data.headline} image={data.image} />
            <Box data={data} />
        </div>
    );
}
