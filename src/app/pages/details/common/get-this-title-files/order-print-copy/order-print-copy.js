import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {useIntl} from 'react-intl';
import './order-print-copy.scss';

function Header({entry}) {
    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={entry.headerIcon} />
                {entry.headerText}
            </h1>
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
                buttonUrl: 'https://he.kendallhunt.com/sites/default/files/uploadedFiles/Kendall_Hunt/OPENSTAX_PRICE_LIST_and_ORDER_FORM.pdf'
            }
        ];
    }, [formatMessage, iframeCode]);

    if (!iframeCode) {
        return null;
    }

    return (
        <nav className='order-print-copy'>
            <PhoneBoxes {...{contentArray}} />
            <DesktopBoxes {...{contentArray}} />
        </nav>
    );
}
