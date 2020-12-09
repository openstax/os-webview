import React, {useState} from 'react';
import {LabeledSection} from '../common';
import {RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './faq.css';

function QnA({question, answer}) {
    const [isOpen, toggle] = useToggle(false);

    return (
        <div className="q-n-a">
            <div className="question" role="button" onClick={() => toggle()}>
                <RawHTML html={question} />
                <FontAwesomeIcon icon={`chevron-${isOpen ? 'up' : 'down'}`} />
            </div>
            {isOpen && <RawHTML className="answer" html={answer} />}
        </div>
    );
}

export default function FAQ({model: {faqHeader: headline, faqs}}) {
    const headerLabel = 'FAQ';

    return (
        <LabeledSection headerLabel={headerLabel} headline={headline}>
            <div className="faq-table">
                {faqs.map((qna) => <QnA {...qna} key={qna.slug} />)}
            </div>
        </LabeledSection>
    );
}
