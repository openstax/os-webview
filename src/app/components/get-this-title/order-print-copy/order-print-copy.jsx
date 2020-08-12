import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
            href={entry.button_url || amazonLink}
            onClick={closeAfterDelay} data-track="Print"
        >
            <Header
                icon={entry.button_url ? 'users' : 'user'}
                heading={entry.heading}
                content={entry.content}
            />
        </a>
    );
}

function PhoneBoxes({bookstoreContent, ...otherProps}) {
    return (
        <div className={`phone-version boxes boxes-${bookstoreContent.length}`}>
            {bookstoreContent.map((entry) => <PhoneBox {...{entry, ...otherProps}} key={entry} />)}
        </div>
    );
}

function DesktopBox({index, entry, amazonLink, closeAfterDelay}) {
    const urlButtonClass = index < 2 ? 'secondary' : '';
    const buttonClass = entry.button_url ? urlButtonClass : 'primary';

    return (<div className="box" key={entry.content}>
        <Header
            icon={entry.button_url ? 'users' : 'user'}
            heading={entry.heading}
            content={entry.content}
        />
        <Button
            href={entry.button_url || amazonLink}
            buttonClass={buttonClass}
            onClick={closeAfterDelay}
            text={entry.button_text}
        />
    </div>);
}

function DesktopBoxes({bookstoreContent, ...otherProps}) {
    return (
        <div className={`larger-version boxes boxes-${bookstoreContent.length}`}>
            {
                bookstoreContent.map((entry, index) =>
                    <DesktopBox {...{index, entry, ...otherProps}} key={entry} />
                )
            }
        </div>
    );
}

export default function OrderPrintCopy(props) {
    return (
        <React.Fragment>
            <PhoneBoxes {...props} />
            <DesktopBoxes {...props} />
        </React.Fragment>
    );
}
