import React from 'react';
import {useToggle} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import cn from 'classnames';
import $ from '~/helpers/$';
import './faq.scss';

const docUrlBase = `${$.apiOriginAndPrefix}/documents`;

function useDocModel(docId) {
    const [docData, setDocData] = React.useState({});

    React.useEffect(() => {
        const url = `${docUrlBase}/${docId}`;

        fetch(url, {credentials: 'include'})
            .then((r) => r.json())
            .catch((err) => {throw new Error(`Fetching ${url}: ${err}`);})
            .then((r) => setDocData({
                title: r.title,
                file: r.meta.download_url
            }))
        ;
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
    const slug = window.location.hash.substr(1);
    const initiallyOpen = slug === qa.slug;
    const [open, toggle] = useToggle(initiallyOpen);
    const ref = React.useRef();

    React.useEffect(() => {
        if (initiallyOpen) {
            ref.current.scrollIntoView({block: 'center'});
        }
    }, [initiallyOpen]);

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
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="desktop-row boxed">
                <div className="faq-list">
                    {questions.map((qa) => <QuestionAndAnswer key={qa.slug} qa={qa} />)}
                </div>
            </div>
        </React.Fragment>
    );
}

export default function FAQLoader() {
    return (
        <main className="faq-page page">
            <LoaderPage slug="pages/faq" Child={FAQ} doDocumentSetup />
        </main>
    );
}
