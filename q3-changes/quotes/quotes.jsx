import React from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './quotes.css';

function QuoteBox({children}) {
    return (
        <div className="quote-box">
            {children}
        </div>
    );
}

function QuoteAndButton({content, link, cta: buttonText}) {
    return (
        <div className="quote">
            <div className="content" dangerouslySetInnerHTML={{__html: content}} />
            <a className="btn primary" href={link}>{buttonText}</a>
        </div>
    );
}

function TutorQuote({data}) {
    return (
        <QuoteBox>
            <img src="/images/home/quotes/tutor-logo-color.svg" alt="" />
            <QuoteAndButton {...data} />
        </QuoteBox>
    );
}

function Newsletter({data}) {
    return (
        <QuoteBox>
            <QuoteAndButton {...data} />
            <div className="mail-check" />
        </QuoteBox>
    );
}

export function Quotes({props}) {
    const [tutorData, newsletterData, otherData] = props;

    return (
        <React.Fragment>
            <TutorQuote data={tutorData} />
            <Newsletter data={newsletterData} />
            <QuoteBox>
                <QuoteAndButton {...otherData} />
            </QuoteBox>
        </React.Fragment>
    );
}

export default class extends WrappedJsx {

    init(props) {
        super.init(Quotes, {props});
        this.view = {
            classes: ['quotes']
        };
    }

}
