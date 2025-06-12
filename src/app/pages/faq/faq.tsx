import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import cn from 'classnames';
import $ from '~/helpers/$';
import './faq.scss';

const docUrlBase = `${$.apiOriginAndPrefix}/documents`;

type DocData = {
    title?: string;
    file?: string;
};

function useDocModel(docId: string) {
    const [docData, setDocData] = React.useState<DocData>({});

    React.useEffect(() => {
        const url = `${docUrlBase}/${docId}`;

        fetch(url, {credentials: 'include'})
            .then((r) => r.json())
            .then((r) =>
                setDocData({
                    title: r.title,
                    file: r.meta.download_url
                })
            );
    }, [docId]);

    return docData;
}

function Document({document}: {document: string}) {
    const {title, file} = useDocModel(document);

    if (!file) {
        return null;
    }

    return (
        <div className="answer">
            <div className="document-title">{title}</div>
            <a className="download-link" href={file}>
                Download
            </a>
        </div>
    );
}

type QAData = {
    slug: string;
    question: string;
    answer: string;
    document?: string;
};

function QuestionAndAnswer({qa}: {qa: QAData}) {
    return (
        <details id={qa.slug} key={qa.slug} className={cn('qa', {open})}>
            <RawHTML Tag="summary" className="question" html={qa.question} />
            <RawHTML className="answer" html={qa.answer} />
            {qa.document && <Document document={qa.document} />}
        </details>
    );
}

function FAQ({
    data: {introHeading: heading, introDescription: subhead, questions}
}: {
    data: {
        introHeading: string;
        introDescription: string;
        questions: QAData[];
    };
}) {
    return (
        <React.Fragment>
            <div className="hero">
                <div className="boxed">
                    <h1>{heading}</h1>
                    <RawHTML className="text-content" html={subhead} />
                </div>
            </div>
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
            <div className="desktop-row boxed">
                <div className="faq-list">
                    {questions.map((qa) => (
                        <QuestionAndAnswer key={qa.slug} qa={qa} />
                    ))}
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
