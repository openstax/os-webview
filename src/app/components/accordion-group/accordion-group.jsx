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

export default function ({
    items,
    accordionProps={allowZeroExpanded: true},
    noScroll=false,
    forwardOnChange
}) {
    const [openTabs, updateOpenTabs] = useState([]);
    const root = useRef();

    function chevronDirection(uuid) {
        return openTabs.includes(uuid) ? 'down' : 'right';
    }

    function onChange(newOpenTabs) {
        if (forwardOnChange) {
            forwardOnChange(newOpenTabs);
        }
        updateOpenTabs(newOpenTabs);
    }

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
            <Accordion {...accordionProps} onChange={onChange} className="accordion-group">
                {
                    items.map((item, index) =>
                        <AccordionItem key={item.title} uuid={item.title} className="accordion-item">
                            <AccordionItemHeading aria-level="2">
                                <AccordionItemButton className="accordion-button">
                                    <div className="label">{item.title}</div>
                                    <div className="chevron">
                                        <FontAwesomeIcon icon={`chevron-${chevronDirection(item.title)}`} />
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className="content-pane">
                                <SuperbItem component={item.contentComponent} />
                            </AccordionItemPanel>
                        </AccordionItem>
                    )
                }
            </Accordion>
        </div>
    );
}
