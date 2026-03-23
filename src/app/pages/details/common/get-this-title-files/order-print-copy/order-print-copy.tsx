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
    trackingLabel: 'Audiobook' | 'Print';
    buttonClass: 'primary' | 'special';
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
    trackingLabel: Content['trackingLabel'];
}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} data-track={trackingLabel}>
            {text}
        </a>
    );
}

function DesktopBox({entry}: {entry: Content}) {
    return (
        <div className="box" key={entry.headerText}>
            <Header entry={entry} />
            <Button
                buttonClass={entry.buttonClass}
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
            {contentArray.map((entry) => (
                <DesktopBox {...{entry}} key={entry.headerText} />
            ))}
        </div>
    );
}

function useBookstoreAndAudiobookLinks(slug: string) {
    const [urls, setUrls] = React.useState<(string | null)[]>([null, null]);

    React.useEffect(() => {
        cmsFetch(slug).then((data) => setUrls([
            data.amazon_link,
            data.audiobook_link
        ]));
    }, [slug]);

    return urls;
}

export default function OrderPrintCopy({slug, campaign}: {slug: string; campaign: UtmCampaign}) {
    const {formatMessage} = useIntl();
    const [bookstoreLink, audiobookLink] = useBookstoreAndAudiobookLinks(slug);
    const contentArray = React.useMemo(() => {
        if (!bookstoreLink && !audiobookLink) {
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

        const content: Content[] = [];

        if (audiobookLink) {
            content.push({
                headerText: audiobook,
                headerIcon: faVolumeUp,
                buttonText: audiobookButtonText,
                buttonUrl: audiobookLink,
                trackingLabel: 'Audiobook',
                buttonClass: 'special'
            });
        }

        if (bookstoreLink) {
            content.push({
                headerText: individual,
                headerIcon: faUser,
                buttonText: button1Text,
                buttonUrl: linkHelper.setUtmCampaign(bookstoreLink, campaign),
                trackingLabel: 'Print',
                buttonClass: 'primary'
            },
            {
                headerText: bookstore,
                headerIcon: faUsers,
                buttonText: button2Text,
                buttonUrl:
                    'https://he.kendallhunt.com/sites/default/files/uploadedFiles/Kendall_Hunt/OPENSTAX_PRICE_LIST_and_ORDER_FORM.pdf',
                trackingLabel: 'Print',
                buttonClass: 'primary'
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
