import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import React from 'react';
import cn from 'classnames';
import $ from '~/helpers/$';
import './faq.css';

const docUrlBase = `${$.apiOriginAndPrefix}/documents`;

function useDocModel(docId) {
    const [docData, setDocData] = React.useState({});

    React.useEffect(() => {
        const url = `${docUrlBase}/${docId}`;

        fetch(url, {credentials: 'include'})
            .then((r) => r.json())
            .then((r) => setDocData({
                title: r.title,
                file: r.meta.download_url
            }));
    }, [docId]);

    return docData;
}

function Document({document}) {
    const {title, file} = useDocModel(document);

    return (
        <div className="answer">
            <div className="document-title">{title}</div>
            <a className="download-link" href={file}>Download</a>
        </div>
    );
}

function QuestionAndAnswer({qa}) {
    const [open, toggle] = useToggle(false);
    const ref = React.useRef();

    React.useEffect(() => {
        const slug = window.location.hash.substr(1);

        if (slug === qa.slug) {
            toggle();
            ref.current.scrollIntoView({block: 'center'});
        }
    }, [toggle]);

    return (
        <div
            id={qa.slug} key={qa.slug} ref={ref} className={cn('qa', {open})}
        >
            <RawHTML className="question" html={qa.question} onClick={() => toggle()} />
            <RawHTML className="answer" html={qa.answer} />
            {qa.document && <Document document={qa.document} />}
        </div>
    );
}

function FAQ({data: {
    introHeading: heading,
    introDescription: subhead,
    questions
}}) {
    return (
        <React.Fragment>
            <div className="hero">
                <div className="boxed">
                    <h1>{heading}</h1>
                    <RawHTML className="text-content" html={subhead} />
                </div>
            </div>
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="desktop-row boxed">
                <div className="faq-list">
                    {questions.map((qa) => <QuestionAndAnswer key={qa.slug} qa={qa} />)}
                </div>
            </div>
        </React.Fragment>
    );
}

function FAQLoader() {
    return (
        <LoaderPage slug="pages/faq" Child={FAQ} doDocumentSetup />
    );
}

const view = {
    classes: ['faq-page', 'page'],
    tag: 'main'
};

export default pageWrapper(FAQLoader, view);
