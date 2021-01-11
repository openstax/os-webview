import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './order-print-copy.css';

function Header({entry}) {
    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={entry.headerIcon} />
                {entry.headerText}
            </h1>
            <RawHTML html={entry.disclosure} />
        </React.Fragment>
    );
}

function PhoneBox({entry, closeAfterDelay}) {
    return (
        <a
            className="box"
            href={entry.buttonUrl}
            onClick={closeAfterDelay} data-track="Print"
        >
            <Header entry={entry} />
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

function DesktopBox({index, entry, closeAfterDelay}) {
    const buttonClass = ['primary', 'secondary'][index];

    return (<div className="box" key={entry.headerText}>
        <Header entry={entry} />
        <Button
            buttonClass={buttonClass}
            href={entry.buttonUrl}
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

export default function OrderPrintCopy({amazonDataLink}) {
    const contentArray = [
        {
            headerText: 'Individual',
            headerIcon: 'user',
            disclosure: amazonDataLink.disclosure,
            buttonText: 'Order a personal copy',
            buttonUrl: amazonDataLink.url
        },
        {
            headerText: 'Bookstore',
            headerIcon: 'users',
            buttonText: 'Order options',
            buttonUrl: 'https://buyprint.openstax.org/bookstore-suppliers'
        }
    ];
    const otherProps = {
        closeAfterDelay(event) {
            if (event) {
                window.requestAnimationFrame(hideDialog);
            }
        }
    };

    return (
        <nav className="order-print-copy">
            <PhoneBoxes {...{contentArray, ...otherProps}} />
            <DesktopBoxes {...{contentArray, ...otherProps}} />
        </nav>
    );
}
