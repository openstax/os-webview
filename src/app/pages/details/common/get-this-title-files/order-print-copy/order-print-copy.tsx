import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {useIntl} from 'react-intl';
import './order-print-copy.scss';
import cmsFetch from '~/helpers/cms-fetch';
import linkHelper, {type UtmCampaign} from '~/helpers/link';

type Content = {
    headerText: string;
    headerIcon: typeof faUser;
    buttonText: string;
    buttonUrl: string;
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
        <a className="box" href={entry.buttonUrl} data-track="Print">
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
    buttonClass
}: {
    href: string;
    text: string;
    buttonClass: string;
}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} data-track="Print">
            {text}
        </a>
    );
}

function DesktopBox({index, entry}: {index: number; entry: Content}) {
    const buttonClass = ['primary', 'secondary'][index];

    return (
        <div className="box" key={entry.headerText}>
            <Header entry={entry} />
            <Button
                buttonClass={buttonClass}
                href={entry.buttonUrl}
                text={entry.buttonText}
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

export default function OrderPrintCopy({slug, campaign}: {slug: string; campaign: UtmCampaign}) {
    const {formatMessage} = useIntl();
    const bookstoreLink = useBookstoreContentLink(slug);
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

        return [
            {
                headerText: individual,
                headerIcon: faUser,
                buttonText: button1Text,
                buttonUrl: linkHelper.setUtmCampaign(bookstoreLink, campaign)
            },
            {
                headerText: bookstore,
                headerIcon: faUsers,
                buttonText: button2Text,
                buttonUrl:
                    'https://he.kendallhunt.com/sites/default/files/uploadedFiles/Kendall_Hunt/OPENSTAX_PRICE_LIST_and_ORDER_FORM.pdf'
            }
        ];
    }, [formatMessage, bookstoreLink, campaign]);

    if (!contentArray) {
        return null;
    }

    return (
        <nav className="order-print-copy" data-analytics-nav="Order print copy">
            <PhoneBoxes {...{contentArray}} />
            <DesktopBoxes {...{contentArray}} />
        </nav>
    );
}
