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

function useChevronDirection(forwardOnChange, preExpanded) {
    const [openTabs, updateOpenTabs] = useState([...preExpanded]);

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

function toUuid(name) {
    return name.replace(/\W+/g, '_');
}

function Item({title, titleTag, checkChevronDirection, contentComponent}) {
    const uuid = toUuid(title);
    const chevronDirection = checkChevronDirection(uuid);

    return (
        <AccordionItem uuid={uuid} className="accordion-item">
            <TitleBar {...{title, titleTag, chevronDirection}} />
            <AccordionItemPanel className="content-pane">
                {
                    React.isValidElement(contentComponent) ?
                        contentComponent :
                        <SuperbItem component={contentComponent} />
                }
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
    const preExpandedUuids = preExpanded.map(toUuid);
    const [chevronDirection, onChange] = useChevronDirection(forwardOnChange, preExpandedUuids);

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
                preExpanded={preExpandedUuids}
            >
                {
                    items.map((item, index) =>
                        item.inline ||
                            <Item key={item.title} {...item} checkChevronDirection={chevronDirection} />
                    )
                }
            </Accordion>
        </div>
    );
}
