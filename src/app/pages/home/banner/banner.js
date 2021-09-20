import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import useUserContext from '~/contexts/user';
import './banner.scss';

function NotLoggedInButtons({data}) {
    return (
        <div className="buttons">
            <a className="btn primary" href={data.getStartedLink}>{data.getStartedText}</a>
            <a className="btn" href={data.loginLink}>{data.loginText}</a>
        </div>
    );
}

function LoggedInButtons({data}) {
    return (
        <div className="buttons">
            <a className="btn" href={data.loggedInLink}>{data.loggedInText}</a>
        </div>
    );
}

export default function Banner({data}) {
    const userModel = useUserContext();
    const Buttons = userModel?.accountId ? LoggedInButtons : NotLoggedInButtons;

    return (
        <section className="banner">
            <img className="left-bg" src={data.leftImage} alt />
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.headline}</h1>
                    <RawHTML html={data.description} />
                    <Buttons data={data} />
                </div>
            </div>
            <ClippedImage className="right-bg" src={data.rightImage} alt />
        </section>
    );
}
