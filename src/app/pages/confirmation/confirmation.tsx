import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import userModel from '~/models/usermodel';
import {useErrataDetail, Errata} from '~/helpers/errata';
import {ErrataDetailBlock} from '~/pages/errata-detail/errata-detail';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import './confirmation.scss';

type ModelKey = 'contact' | 'errata';
const models = {
    contact: {
        headline: 'Thanks for contacting us',
        adoptionQuestion: 'Have you looked at our books lately?',
        adoptionUrl: '/subjects',
        adoptionLinkText: 'Check out our subjects'
    },
    errata: {
        headline: 'Thanks for your help!',
        adoptionQuestion: `Your contribution helps keep OpenStax resources high quality
        and up to date.`,
        belowHeaderText: 'Have more errata to submit?'
    }
};

function useReferringPage() {
    const {pathname} = useLocation();
    let referringPage = pathname.replace('/confirmation/', '');

    if (referringPage === pathname) {
        referringPage = pathname
            .replace('-confirmation', '')
            .replace(/^\//, '');
    }
    return referringPage as ModelKey;
}

function useDefaultEmail() {
    const [email, setEmail] = useState<string>();

    useEffect(() => {
        async function fetchData() {
            const response = await userModel.load();

            setEmail(response.email);
        }
        fetchData();
    }, []);
    return email;
}

function SubmitAgainButton({detail}: {detail: {bookTitle: string}}) {
    const url = `/errata/form?book=${encodeURIComponent(detail.bookTitle)}`;
    const text = `Submit ${detail.bookTitle} errata`;

    return (
        <a className="btn white-on-blue" href={url}>
            {text}
        </a>
    );
}

function BelowHeader({text, data}: {text: string; data?: Errata}) {
    const detail = useErrataDetail(data);

    return (
        <div className="wrapper">
            <div className="text-content">
                <div className="below-header-text">{text}</div>
                <div className="buttons">
                    {detail && <SubmitAgainButton detail={detail} />}
                </div>
            </div>
        </div>
    );
}

function ErrataStatusNotification({errataId}: {errataId: string}) {
    const email = useDefaultEmail();
    const notifyByEmail = email && email !== 'none@openstax.org';

    return notifyByEmail ? (
        ` We'll be sending submission updates to ${email}.`
    ) : (
        <React.Fragment>
            <br />
            <a className="header-link" href={`/errata/${errataId}`}>
                Track the status of your submission
            </a>
        </React.Fragment>
    );
}

function ErrataButtonsAndDetail({
    errataId,
    text
}: {
    errataId: string;
    text: string;
}) {
    const slug = `errata/${errataId}`;
    const data = camelCaseKeys(useDataFromSlug(slug)) as Errata;

    return (
        <React.Fragment>
            {Boolean(text) && <BelowHeader text={text} data={data} />}
            <div className="wrapper">
                <div className="boxed">
                    {data && <ErrataDetailBlock data={data} />}
                </div>
            </div>
        </React.Fragment>
    );
}

export default function Confirmation() {
    const referringPage = useReferringPage();
    const isErrata = referringPage === 'errata';
    const {search} = useLocation();
    const id = new window.URLSearchParams(search).get(
        'id'
    ) as string;
    const {headline, adoptionQuestion} = models[referringPage];
    const adoptionModel = models.contact;
    const errataModel = models.errata;

    useDocumentHead({title: 'Thanks!'});
    useCanonicalLink();

    return (
        <div className="confirmation-page page">
            <div className="page-intro">
                <div className="subhead">
                    <div className="text-content centered">
                        <h1>{headline}</h1>
                        <p>
                            {adoptionQuestion}
                            {isErrata && (
                                <ErrataStatusNotification errataId={id} />
                            )}
                        </p>
                        {referringPage === 'contact' && (
                            <a
                                href={adoptionModel.adoptionUrl}
                                title={adoptionModel.adoptionLinkText}
                                className="btn cta"
                            >
                                {adoptionModel.adoptionLinkText}
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
            {isErrata ? (
                <ErrataButtonsAndDetail
                    errataId={id}
                    text={errataModel.belowHeaderText}
                />
            ) : (
                <div className="wrapper" />
            )}
        </div>
    );
}
