import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import { useIntl } from 'react-intl';
import './order-print-copy.scss';

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

export default function OrderPrintCopy({amazonDataLink, hideDialog}) {
    const { formatMessage } = useIntl();
    const contentArray = React.useMemo(
        () => {
            const individual = formatMessage({
                id: 'printcopy.individual',
                defaultMessage: 'Individual'
            });
            const bookstore = formatMessage({
                id: 'printcopy.bookstore',
                defaultMessage: 'Bookstore'
            });
            const disclosure = formatMessage({
                id: 'printcopy.disclosure',
                defaultMessage: '***'
            });
            const button1Text = formatMessage({
                id: 'printcopy.button1',
                defaultMessage: 'Order a personal copy'
            });
            const button2Text = formatMessage({
                id: 'printcopy.button2',
                defaultMessage: 'Order options'
            });

            return [
                {
                    headerText: individual,
                    headerIcon: faUser,
                    disclosure: disclosure === '***' ? amazonDataLink.disclosure : disclosure,
                    buttonText: button1Text,
                    buttonUrl: amazonDataLink.url
                },
                {
                    headerText: bookstore,
                    headerIcon: faUsers,
                    buttonText: button2Text,
                    buttonUrl: 'https://buyprint.openstax.org/bookstore-suppliers'
                }
            ];
        },
        [amazonDataLink, formatMessage]
    );
    const otherProps = React.useMemo(
        () => ({
            closeAfterDelay(event) {
                if (event) {
                    window.requestAnimationFrame(hideDialog);
                }
            }
        }),
        [hideDialog]
    );

    return (
        <nav className="order-print-copy">
            <PhoneBoxes {...{contentArray, ...otherProps}} />
            <DesktopBoxes {...{contentArray, ...otherProps}} />
        </nav>
    );
}
