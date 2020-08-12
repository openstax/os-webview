import React, {useState, useEffect} from 'react';
import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import settings from 'settings';
import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import userModel from '~/models/usermodel';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import {getDetailModel} from '~/helpers/errata';
import Detail from '~/pages/errata-detail/detail/detail';
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

function useErrataButtonsAndDetail(errataId) {
    const slug = `errata/${errataId}`;
    const [belowHeaderButtons, setBelowHeaderButtons] = useState([]);
    const [detailComponent, setDetailComponent] = useState();

    useEffect(() => {
        async function fetchData() {
            const detail = await fetchFromCMS(slug);
            const detailModel = await getDetailModel(detail);

            setDetailComponent(new Detail(detailModel));
            setBelowHeaderButtons([{
                text: `Submit ${detailModel.detail.bookTitle} errata`,
                colorScheme: 'white-on-blue',
                url: `/errata/form?book=${encodeURIComponent(detailModel.detail.bookTitle)}`
            }]);
        }
        fetchData();
    }, [errataId, slug]);

    return [belowHeaderButtons, detailComponent];
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

function BelowHeader({text, buttons}) {
    return (
        <div className="wrapper">
            <div className="text-content">
                <div className="below-header-text">{text}</div>
                <div className="buttons">
                    {
                        buttons.map((b) =>
                            <a className={`btn ${b.colorScheme}`} href={b.url} key={b}>
                                {b.text}
                            </a>
                        )
                    }
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
    const [buttons, detailComponent] = useErrataButtonsAndDetail(errataId);

    return (
        <React.Fragment>
            {
                Boolean(text) &&
                    <BelowHeader text={text} buttons={buttons} />
            }
            <div className="wrapper">
                {
                    Boolean(detailComponent) &&
                        <SuperbItem component={detailComponent} className="boxed" />
                }
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
