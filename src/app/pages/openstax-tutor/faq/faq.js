import React from 'react';
import {LabeledSection} from '../common';
import {useToggle} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import './faq.scss';

function QnA({question, answer}) {
    const [isOpen, toggle] = useToggle(false);

    return (
        <div className="q-n-a">
            <div className="question" role="button" onClick={() => toggle()}>
                <RawHTML html={question} />
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
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
