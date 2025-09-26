import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {Countdown, Amount, GiveButton, BoxData, TakeoverData} from './common';
import './content-desktop.scss';

function Logo() {
    return (
        <img
            className="logo-color" src="/dist/images/logo.svg" alt="OpenStax logo"
            width="354" height="81"
        />
    );
}

function Basic({headline, message, image, children}: {
    headline: string;
    message: string;
    image: string;
    children: React.ReactNode;
}) {
    return (
        <div className="takeover-content desktop-only">
            <div className="text-side">
                <Logo />
                <RawHTML Tag="h1" html={headline} id="takeover-headline" />
                <div className="message">{message}</div>
                {children}
            </div>
            <div className="picture-side" style={{backgroundImage: `url(${image})`}} />
        </div>
    );
}

function MessageBox({buttonText, buttonUrl, headline, html}: {
    buttonText: string;
    buttonUrl: string;
    headline: string;
    html: string;
}) {
    return (
        <React.Fragment>
            <GiveButton text={buttonText} url={buttonUrl} />
            <div className="message-box">
                <div className="color-fill" />
                <div className="text-content">
                    <h2>{headline}</h2>
                    <RawHTML html={html} />
                </div>
            </div>
        </React.Fragment>
    );
}

function GoalBox({buttonText, buttonUrl, goalAmount, goalTime}: {
    buttonText: string;
    buttonUrl: string;
    goalAmount: number;
    goalTime: string;
}) {
    return (
        <div className="goal-box">
            <Amount amount={goalAmount} />
            <div className="timer-side">
                <a className="btn primary" href={buttonUrl}>{buttonText}</a>
                <div className="message">help us meet our goal in the next</div>
                <Countdown goalTime={goalTime} />
            </div>
        </div>
    );
}


function Box({data}: {data: BoxData}) {
    const boxComponents: Record<string, React.ReactNode> = {
        message: <MessageBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            headline={data.boxHeadline!} html={data.boxHtml!}
        />,
        goal: <GoalBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            goalAmount={data.goalAmount!} goalTime={data.goalTime!}
        />
    };

    return boxComponents[data.messageType] || <h1>OOPS, {data.messageType}</h1>;
}

export default function DesktopContent({data}: {data: TakeoverData}) {
    return (
        <Basic
            headline={data.headline} message={data.message}
            image={data.image}
        >
            <Box data={data} />
        </Basic>
    );
}
