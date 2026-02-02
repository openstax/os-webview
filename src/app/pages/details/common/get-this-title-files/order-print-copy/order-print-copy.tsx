import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import {useIntl} from 'react-intl';
import './order-print-copy.scss';
import cmsFetch from '~/helpers/cms-fetch';
import linkHelper, {type UtmCampaign} from '~/helpers/link';

type Content = {
    headerText: string;
    headerIcon: typeof faUser;
    buttonText: string;
    buttonUrl: string;
    trackingLabel: string;
};

function Header({entry}: {entry: Content}) {
    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={entry.headerIcon} />
                {entry.headerText}
            </h1>
        </React.Fragment>
    );
}

function PhoneBox({entry}: {entry: Content}) {
    return (
        <a className="box" href={entry.buttonUrl} data-track={entry.trackingLabel}>
            <Header entry={entry} />
        </a>
    );
}

function PhoneBoxes({contentArray}: {contentArray: Content[]}) {
    return (
        <div className={`phone-version boxes boxes-${contentArray.length}`}>
            {contentArray.map((entry) => (
                <PhoneBox {...{entry}} key={entry.headerText} />
            ))}
        </div>
    );
}

function Button({
    href,
    text,
    buttonClass,
    trackingLabel
}: {
    href: string;
    text: string;
    buttonClass: string;
    trackingLabel: string;
}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} data-track={trackingLabel}>
            {text}
        </a>
    );
}

function DesktopBox({index, entry}: {index: number; entry: Content}) {
    const buttonClass = ['primary', 'primary', 'secondary'][index] || 'primary';

    return (
        <div className="box" key={entry.headerText}>
            <Header entry={entry} />
            <Button
                buttonClass={buttonClass}
                href={entry.buttonUrl}
                text={entry.buttonText}
                trackingLabel={entry.trackingLabel}
            />
        </div>
    );
}

function DesktopBoxes({contentArray}: {contentArray: Content[]}) {
    return (
        <div className={`larger-version boxes boxes-${contentArray.length}`}>
            {contentArray.map((entry, index) => (
                <DesktopBox {...{index, entry}} key={entry.headerText} />
            ))}
        </div>
    );
}

function useBookstoreContentLink(slug: string) {
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        cmsFetch(slug).then((data) => setUrl(data.amazon_link));
    }, [slug]);

    return url;
}

function useAudiobookLink(slug: string) {
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        cmsFetch(slug).then((data) => setUrl(data.audiobook_link));
    }, [slug]);

    return url;
}

export default function OrderPrintCopy({slug, campaign}: {slug: string; campaign: UtmCampaign}) {
    const {formatMessage} = useIntl();
    const bookstoreLink = useBookstoreContentLink(slug);
    const audiobookLink = useAudiobookLink(slug);
    const contentArray = React.useMemo(() => {
        if (!bookstoreLink) {
            return null;
        }
        const individual = formatMessage({
            id: 'printcopy.individual',
            defaultMessage: 'Individual'
        });
        const button1Text = formatMessage({
            id: 'printcopy.button1',
            defaultMessage: 'Buy a print copy'
        });
        const bookstore = formatMessage({
            id: 'printcopy.bookstore',
            defaultMessage: 'Bookstore'
        });
        const button2Text = formatMessage({
            id: 'printcopy.button2',
            defaultMessage: 'Order options'
        });
        const audiobook = formatMessage({
            id: 'printcopy.audiobook',
            defaultMessage: 'Audiobook'
        });
        const audiobookButtonText = formatMessage({
            id: 'printcopy.audiobook-button',
            defaultMessage: 'Purchase options'
        });

        const content = [
            {
                headerText: individual,
                headerIcon: faUser,
                buttonText: button1Text,
                buttonUrl: linkHelper.setUtmCampaign(bookstoreLink, campaign),
                trackingLabel: 'Print'
            },
            {
                headerText: bookstore,
                headerIcon: faUsers,
                buttonText: button2Text,
                buttonUrl:
                    'https://he.kendallhunt.com/sites/default/files/uploadedFiles/Kendall_Hunt/OPENSTAX_PRICE_LIST_and_ORDER_FORM.pdf',
                trackingLabel: 'Print'
            }
        ];

        // Add audiobook option at the end if link is available
        if (audiobookLink) {
            content.push({
                headerText: audiobook,
                headerIcon: faVolumeUp,
                buttonText: audiobookButtonText,
                buttonUrl: audiobookLink,
                trackingLabel: 'Audiobook'
            });
        }

        return content;
    }, [formatMessage, bookstoreLink, audiobookLink, campaign]);

    if (!contentArray) {
        return null;
    }

    return (
        <nav
          className="order-print-copy"
          aria-label="Order print copy Navigation"
          data-analytics-nav="Order print copy"
        >
            <PhoneBoxes {...{contentArray}} />
            <DesktopBoxes {...{contentArray}} />
        </nav>
    );
}
