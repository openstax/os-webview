import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {useIntl} from 'react-intl';
import './order-print-copy.scss';
import amazonSnippet from '~/models/amazon-snippet';
import {usePromise} from '~/helpers/use-data';

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
    if (typeof entry === 'string') {
        return <RawHTML className='iframe-box' html={entry} />;
    }

    return (
        <a
            className='box'
            href={entry.buttonUrl}
            onClick={closeAfterDelay}
            data-track='Print'
        >
            <Header entry={entry} />
        </a>
    );
}

function PhoneBoxes({contentArray}) {
    return (
        <div className={`phone-version boxes boxes-${contentArray.length}`}>
            {contentArray.map((entry) => (
                <PhoneBox {...{entry}} key={entry} />
            ))}
        </div>
    );
}

function Button({href, text, buttonClass, onClick}) {
    return (
        <a
            className={`btn ${buttonClass}`}
            href={href}
            onClick={onClick}
            data-track='Print'
        >
            {text}
        </a>
    );
}

function DesktopBox({index, entry}) {
    const buttonClass = ['primary', 'secondary'][index];

    if (typeof entry === 'string') {
        return <RawHTML className='iframe-box' html={entry} />;
    }

    return (
        <div className='box' key={entry.headerText}>
            <Header entry={entry} />
            <Button
                buttonClass={buttonClass}
                href={entry.buttonUrl}
                text={entry.buttonText}
            />
        </div>
    );
}

function DesktopBoxes({contentArray}) {
    return (
        <div className={`larger-version boxes boxes-${contentArray.length}`}>
            {contentArray.map((entry, index) => (
                <DesktopBox {...{index, entry}} key={entry} />
            ))}
        </div>
    );
}

export default function OrderPrintCopy({iframeCode}) {
    const {formatMessage} = useIntl();
    const contentArray = React.useMemo(() => {
        const bookstore = formatMessage({
            id: 'printcopy.bookstore',
            defaultMessage: 'Bookstore'
        });
        const button2Text = formatMessage({
            id: 'printcopy.button2',
            defaultMessage: 'Order options'
        });

        return [
            iframeCode,
            {
                headerText: bookstore,
                headerIcon: faUsers,
                buttonText: button2Text,
                buttonUrl: 'https://buyprint.openstax.org/bookstore-suppliers'
            }
        ];
    }, [formatMessage, iframeCode]);
    const blurb = usePromise(amazonSnippet, '');

    return (
        <nav className='order-print-copy'>
            <div className='blurb'>
                {blurb}
            </div>
            <PhoneBoxes {...{contentArray}} />
            <DesktopBoxes {...{contentArray}} />
        </nav>
    );
}
