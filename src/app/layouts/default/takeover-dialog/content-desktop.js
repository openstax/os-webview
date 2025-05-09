import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {Countdown, Amount, GiveButton} from './common';
import './content-desktop.scss';

function Logo() {
    return (
        <img
            className="logo-color" src="/dist/images/logo.svg" alt="OpenStax logo"
            width="354" height="81"
        />
    );
}

function Basic({headline, message, image, children}) {
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

function MessageBox({buttonText, buttonUrl, headline, html}) {
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

function GoalBox({buttonText, buttonUrl, goalAmount, goalTime}) {
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

function Box({data}) {
    return ({
        message: <MessageBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            headline={data.boxHeadline} html={data.boxHtml}
        />,
        goal: <GoalBox
            buttonText={data.buttonText} buttonUrl={data.buttonUrl}
            goalAmount={data.goalAmount} goalTime={data.goalTime}
        />
    }[data.messageType] || <h1>OOPS, {data.messageType}</h1>);
}

export default function DesktopContent({data}) {
    return (
        <Basic
            headline={data.headline} message={data.message}
            image={data.image}
        >
            <Box data={data} />
        </Basic>
    );
}
