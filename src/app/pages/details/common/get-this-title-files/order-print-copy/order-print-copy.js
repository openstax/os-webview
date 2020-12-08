import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './order-print-copy.css';

function Header({entry, disclosure}) {
    const icon = entry.buttonUrl ? 'users' : 'user';

    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={icon} />
                {entry.heading}
            </h1>
            <RawHTML html={disclosure || entry.content.content} />
        </React.Fragment>
    );
}

function PhoneBox({entry, amazonDataLink, closeAfterDelay}) {
    const [href, disclosure] = entry.buttonUrl ?
        [entry.buttonUrl, ''] :
        [amazonDataLink.url, amazonDataLink.disclosure];

    return (
        <a
            className="box"
            href={href}
            onClick={closeAfterDelay} data-track="Print"
        >
            <Header entry={entry} disclosure={disclosure} />
        </a>
    );
}

function PhoneBoxes({contentArray, ...otherProps}) {
    return (
        <div className={`phone-version boxes boxes-${contentArray.length}`}>
            {contentArray.map((entry) => <PhoneBox {...{entry, ...otherProps}} key={entry} />)}
        </div>
    );
}

function Button({href, text, buttonClass, onClick}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} onClick={onClick} data-track="Print">
            {text}
        </a>
    );
}

function DesktopBox({index, entry, amazonDataLink, closeAfterDelay}) {
    const urlButtonClass = index < 2 ? 'secondary' : '';
    const [buttonClass, href, disclosure, buttonText] = entry.buttonUrl ?
        [urlButtonClass, entry.buttonUrl, '', entry.buttonText] :
        [
            'primary', amazonDataLink.url,
            amazonDataLink.disclosure || amazonDataLink.provider,
            entry.buttonText || amazonDataLink.provider
        ];

    return (<div className="box" key={entry.content}>
        <Header entry={entry} disclosure={disclosure} />
        <Button
            href={href}
            buttonClass={buttonClass}
            onClick={closeAfterDelay}
            text={buttonText}
        />
    </div>);
}

function DesktopBoxes({contentArray, ...otherProps}) {
    return (
        <div className={`larger-version boxes boxes-${contentArray.length}`}>
            {
                contentArray.map((entry, index) =>
                    <DesktopBox {...{index, entry, ...otherProps}} key={entry} />
                )
            }
        </div>
    );
}

export default function OrderPrintCopy({bookstoreContent, ...otherProps}) {
    const contentArray = bookstoreContent;

    return (
        <nav className="order-print-copy">
            <PhoneBoxes {...{contentArray, ...otherProps}} />
            <DesktopBoxes {...{contentArray, ...otherProps}} />
        </nav>
    );
}
