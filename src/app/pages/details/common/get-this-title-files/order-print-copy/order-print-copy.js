import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './order-print-copy.css';

function Header({icon, heading, content}) {
    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={icon} />
                {heading}
            </h1>
            <RawHTML html={content} />
        </React.Fragment>
    );
}

function Button({href, text, buttonClass, onClick}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} onClick={onClick} data-track="Print">
            {text}
        </a>
    );
}

function PhoneBox({entry, amazonLink, closeAfterDelay}) {
    return (
        <a
            className="box"
            href={entry.buttonUrl || amazonLink}
            onClick={closeAfterDelay} data-track="Print"
        >
            <Header
                icon={entry.buttonUrl ? 'users' : 'user'}
                heading={entry.heading}
                content={entry.content}
            />
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

function DesktopBox({index, entry, amazonLink, closeAfterDelay}) {
    const urlButtonClass = index < 2 ? 'secondary' : '';
    const buttonClass = entry.buttonUrl ? urlButtonClass : 'primary';

    return (<div className="box" key={entry.content}>
        <Header
            icon={entry.buttonUrl ? 'users' : 'user'}
            heading={entry.heading}
            content={entry.content}
        />
        <Button
            href={entry.buttonUrl || amazonLink}
            buttonClass={buttonClass}
            onClick={closeAfterDelay}
            text={entry.buttonText}
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
    const contentArray = bookstoreContent.length ? bookstoreContent : [bookstoreContent.content];

    return (
        <nav className="order-print-copy">
            <PhoneBoxes {...{contentArray, ...otherProps}} />
            <DesktopBoxes {...{contentArray, ...otherProps}} />
        </nav>
    );
}
