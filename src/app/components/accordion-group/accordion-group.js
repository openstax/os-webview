import React from 'react';
import $ from '~/helpers/$';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel
} from 'react-accessible-accordion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import './accordion-group.scss';

function useChevronDirection(forwardOnChange, preExpanded) {
    const [openTabs, updateOpenTabs] = React.useState([...preExpanded]);
    const chevronDirection = React.useCallback(
        (uuid) => openTabs.includes(uuid) ? 'up' : 'down',
        [openTabs]
    );
    const onChange = React.useCallback(
        (newOpenTabs) => {
            if (forwardOnChange) {
                forwardOnChange(newOpenTabs);
            }
            updateOpenTabs(newOpenTabs);
        },
        [forwardOnChange, updateOpenTabs]
    );

    return [chevronDirection, onChange];
}

function TooltipButton({content}) {
    const ref = React.useRef();
    const focus = React.useCallback(
        (e) => {
            ref.current.focus();
            e.stopPropagation();
        },
        []
    );

    return (
        <span
            className="info-trigger" tabIndex="0" ref={ref}
            href="tooltip"
            onMouseEnter={() => ref.current.focus()}
            onMouseLeave={() => ref.current.blur()}
            onClick={focus}
        >
            <FontAwesomeIcon icon={faCircleInfo} />
            <div role="tooltip">
                {content}
            </div>
        </span>
    );
}

function TitleBar({title, titleTag, chevronDirection, tooltipContent}) {
    const icon = ({
        down: faChevronDown,
        up: faChevronUp
    })[chevronDirection];

    return (
        <AccordionItemHeading aria-level="2">
            <AccordionItemButton className="accordion-button">
                <div className="label">
                    {title}
                    {
                        titleTag &&
                            <span className="title-tag">{titleTag}</span>
                    }
                    {tooltipContent && <TooltipButton content={tooltipContent} />}
                </div>
                <div className="chevron">
                    <FontAwesomeIcon icon={icon} />
                </div>
            </AccordionItemButton>
        </AccordionItemHeading>
    );
}

function toUuid(name) {
    return name.replace(/\W+/g, '_');
}

function Item({title, titleTag, tooltipContent, checkChevronDirection, contentComponent}) {
    const uuid = toUuid(title);
    const chevronDirection = checkChevronDirection(uuid);

    return (
        <AccordionItem uuid={uuid} className="accordion-item">
            <TitleBar {...{title, titleTag, tooltipContent, chevronDirection}} />
            <AccordionItemPanel className="content-pane">
                {contentComponent}
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
    const root = React.useRef();
    const preExpandedUuids = preExpanded.map(toUuid);
    const [chevronDirection, onChange] = useChevronDirection(forwardOnChange, preExpandedUuids);
    const scrollAndChangeChevronPlus = React.useCallback(
        (...args) => {
            if (!noScroll) {
                window.setTimeout(
                    () => {
                        const openItem = root.current?.querySelector('[aria-expanded="true"]');

                        if (openItem) {
                            $.scrollTo(openItem);
                        }
                    },
                    20
                );
            }
            onChange(...args);
        },
        [onChange, noScroll]
    );

    return (
        <div ref={root}>
            <Accordion
                {...accordionProps}
                onChange={scrollAndChangeChevronPlus}
                className="accordion-group"
                preExpanded={preExpandedUuids}
            >
                {
                    items.map((item) =>
                        item.inline ||
                            <Item key={item.title} {...item} checkChevronDirection={chevronDirection} />
                    )
                }
            </Accordion>
        </div>
    );
}
