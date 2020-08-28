import React, {useState} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import cn from 'classnames';

function QnA({item}) {
    const [isOpen, setIsOpen] = useState(false);

    function toggle() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="smaller qna">
            <div className="toggled-item" role="button" onClick={toggle}>
                <RawHTML className="question" html={item.question} />
                <div className={cn('toggler', {open: isOpen})}>
                    <FontAwesomeIcon icon={`chevron-${isOpen ? 'up' : 'down'}`} />
                </div>
            </div>
            <div className={cn('toggled-item', {hidden: !isOpen})}>
                <RawHTML className="answer" html={item.answer} />
            </div>
        </div>
    );
}

export default function FAQ({model}) {
    return (
        <section id="faq">
            <div className="boxed">
                <h1>{model.section6Heading}</h1>
            </div>
            <div className="questions text-content">
                {model.faqs.map((item) => <QnA item={item} key={item.question} />)}
                <RawHTML className="see-more smaller qna" html={model.section6KnowledgeBaseCopy} />
            </div>
        </section>
    );
}
