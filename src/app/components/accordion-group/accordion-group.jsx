import React, {useState, useRef, useEffect} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel
} from 'react-accessible-accordion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './accordion-group.css';
import $ from '~/helpers/$';
import {SuperbItem} from '~/controllers/jsx-wrapper';

function useChevronDirection(forwardOnChange) {
    const [openTabs, updateOpenTabs] = useState([]);

    function chevronDirection(uuid) {
        return openTabs.includes(uuid) ? 'down' : 'right';
    }

    function onChange(newOpenTabs) {
        if (forwardOnChange) {
            forwardOnChange(newOpenTabs);
        }
        updateOpenTabs(newOpenTabs);
    }

    return [chevronDirection, onChange];
}

function TitleBar({title, titleTag, chevronDirection}) {
    return (
        <AccordionItemHeading aria-level="2">
            <AccordionItemButton className="accordion-button">
                <div className="label">
                    {title}
                    {titleTag && <span className="title-tag">{titleTag}</span>}
                </div>
                <div className="chevron">
                    <FontAwesomeIcon icon={`chevron-${chevronDirection}`} />
                </div>
            </AccordionItemButton>
        </AccordionItemHeading>
    );
}

function Item({title, titleTag, chevronDirection, contentComponent}) {
    const child = React.isValidElement(contentComponent) ?
        contentComponent:
        <SuperbItem component={contentComponent} />;

    return (
        <AccordionItem uuid={title} className="accordion-item">
            <TitleBar {...{title, titleTag, chevronDirection}} />
            <AccordionItemPanel className="content-pane">
                {child}
            </AccordionItemPanel>
        </AccordionItem>
    );
}

export default function AccordionGroup({
    items,
    accordionProps={allowZeroExpanded: true},
    noScroll=false,
    forwardOnChange,
    preExpanded=[]
}) {
    const root = useRef();
    const [chevronDirection, onChange] = useChevronDirection(forwardOnChange);

    useEffect(() => {
        if (!noScroll) {
            const openItem = root.current.querySelector('[aria-expanded="true"]');

            if (openItem) {
                $.scrollTo(openItem);
            }
        }
    });

    return (
        <div ref={root}>
            <Accordion
                {...accordionProps}
                onChange={onChange}
                className="accordion-group"
                preExpanded={preExpanded}
            >
                {
                    items.map((item, index) =>
                        <Item key={item.title} {...item} chevronDirection={chevronDirection(item.title)} />
                    )
                }
            </Accordion>
        </div>
    );
}
