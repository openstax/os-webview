import React, {useState, useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import settings from 'settings';
import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import userModel from '~/models/usermodel';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import {useErrataDetail} from '~/helpers/errata';
import {ErrataDetailBlock} from '~/pages/errata-detail/errata-detail';
import {LoaderPage, useDataFromSlug, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './confirmation.css';

const applyLink = `${settings.accountHref}/faculty_access/apply?r=${encodeURIComponent(`${settings.apiOrigin}/`)}`;
const view = {
    classes: ['confirmation-page', 'page']
};
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

function getReferringPage() {
    let referringPage = window.location.pathname.replace('/confirmation/', '');

    if (referringPage === window.location.pathname) {
        referringPage = window.location.pathname
            .replace('-confirmation', '')
            .replace(/^\//, '');
    }
    return referringPage;
}

function useDefaultEmail() {
    const [email, setEmail] = useState();

    useEffect(() => {
        async function fetchData() {
            const response = await userModel.load();

            setEmail(response.email);
        }
        fetchData();
    }, []);
    return email;
}

function SubmitAgainButton({detail}) {
    const url = `/errata/form?book=${encodeURIComponent(detail.bookTitle)}`;
    const text = `Submit ${detail.bookTitle} errata`;

    return (
        <a className="btn white-on-blue" href={url}>
            {text}
        </a>

    );
}

function BelowHeader({text, data}) {
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

function ErrataStatusNotification({errataId}) {
    const email = useDefaultEmail();
    const notifyByEmail = email && email !== 'none@openstax.org';

    if (!errataId) {
        return null;
    }

    return (
        notifyByEmail ?
            `We'll be sending submission updates to ${email}.` :
            <React.Fragment>
                <br />
                <a className="header-link" href={`/errata/${errataId}`}>
                    Track the status of your submission
                </a>
            </React.Fragment>
    );
}

function ErrataButtonsAndDetail({errataId, text}) {
    const slug = `errata/${errataId}`;
    const data = $.camelCaseKeys(useDataFromSlug(slug));

    return (
        <React.Fragment>
            {
                Boolean(text) &&
                    <BelowHeader text={text} data={data} />
            }
            <div className="wrapper">
                <div className="boxed">
                    {data && <ErrataDetailBlock data={data} />}
                </div>
            </div>
        </React.Fragment>
    );
}

function Page() {
    const referringPage = getReferringPage();
    const isErrata = referringPage === 'errata';
    const {id} = $.parseSearchString(window.location.search);
    const errataId = isErrata ? id[0] : null;
    const {
        headline,
        adoptionQuestion,
        adoptionUrl,
        adoptionLinkText,
        belowHeaderText
    } = models[referringPage];

    $.setPageTitleAndDescription('Thanks!');
    $.setCanonicalLink(`/${referringPage}-confirmation`);

    return (
        <React.Fragment>
            <div className="page-intro">
                <div className="subhead">
                    <div className="text-content centered">
                        <h1>{headline}</h1>
                        <p>{adoptionQuestion}
                            {
                                isErrata &&
                                    <ErrataStatusNotification errataId={errataId} />
                            }
                        </p>
                        {
                            Boolean(adoptionUrl) &&
                                <a
                                    href={adoptionUrl}
                                    title={adoptionLinkText}
                                    className="btn cta"
                                >{adoptionLinkText}</a>
                        }
                    </div>
                </div>
            </div>
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            {
                isErrata ?
                    <ErrataButtonsAndDetail errataId={errataId} text={belowHeaderText} /> :
                    <div className="wrapper" />
            }
        </React.Fragment>
    );
}

export default pageWrapper(Page, view);
