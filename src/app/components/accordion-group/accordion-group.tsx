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

type FunctionOrFalse = false | ((n: unknown) => void);

function useChevronDirection(forwardOnChange: FunctionOrFalse, preExpanded: unknown[]) {
    const [openTabs, updateOpenTabs] = React.useState([...preExpanded]);
    const chevronDirection = React.useCallback(
        (uuid: string) => openTabs.includes(uuid) ? 'up' : 'down',
        [openTabs]
    );
    const onChange = React.useCallback(
        (newOpenTabs: unknown[]) => {
            if (forwardOnChange) {
                forwardOnChange(newOpenTabs);
            }
            updateOpenTabs(newOpenTabs);
        },
        [forwardOnChange, updateOpenTabs]
    );

    return [chevronDirection, onChange] as const;
}

function TooltipButton({content}: {content: React.ReactNode}) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const focus = React.useCallback(
        (e: React.MouseEvent) => {
            ref.current?.focus();
            e.stopPropagation();
        },
        []
    );

    return (
        <span
            className="info-trigger" tabIndex={0} ref={ref}
            onMouseEnter={() => ref.current?.focus()}
            onMouseLeave={() => ref.current?.blur()}
            onClick={focus}
        >
            <FontAwesomeIcon icon={faCircleInfo} />
            <div role="tooltip">
                {content}
            </div>
        </span>
    );
}

type ChevronDirection = 'up' | 'down';

function TitleBar({title, titleTag, chevronDirection, tooltipContent, analytics}: {
    title: string;
    titleTag?: string;
    chevronDirection: ChevronDirection;
    tooltipContent?: React.ReactNode;
    analytics?: boolean;
}) {
    const icon = ({
        down: faChevronDown,
        up: faChevronUp
    })[chevronDirection];
    const isOpen = chevronDirection === 'up';

    return (
        <AccordionItemHeading aria-level="2">
            <AccordionItemButton
                className="accordion-button"
                data-analytics-link={analytics && !isOpen ? '' : undefined}
            >
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

function toUuid(name: string) {
    return name.replace(/\W+/g, '_');
}

function Item({title, titleTag, tooltipContent, checkChevronDirection, contentComponent, analytics}:
    Omit<Parameters<typeof TitleBar>[0], 'chevronDirection'> & {
        contentComponent: React.ReactNode;
        checkChevronDirection: (u: string) => ChevronDirection;
}) {
    const uuid = toUuid(title);
    const chevronDirection = checkChevronDirection(uuid);

    return (
        <AccordionItem uuid={uuid} className="accordion-item">
            <TitleBar {...{title, titleTag, tooltipContent, chevronDirection, analytics}} />
            <AccordionItemPanel className="content-pane">
                {contentComponent}
            </AccordionItemPanel>
        </AccordionItem>
    );
}

type ItemType = {
    title: string;
    inline?: React.ReactNode;
    contentComponent: React.ReactNode;
}

export default function AccordionGroup({
    items,
    accordionProps={allowZeroExpanded: true},
    noScroll=false,
    forwardOnChange=false,
    preExpanded=[],
    'data-analytics-nav': analyticsNav
}: {
    items: ItemType[];
    accordionProps?: object;
    noScroll?: boolean;
    forwardOnChange?: FunctionOrFalse;
    preExpanded?: string[];
    'data-analytics-nav'?: string;
}) {
    const root = React.useRef<HTMLDivElement>(null);
    const preExpandedUuids = preExpanded.map(toUuid);
    const [chevronDirection, onChange] = useChevronDirection(forwardOnChange, preExpandedUuids);
    const scrollAndChangeChevronPlus = React.useCallback(
        (newOpenTabs: unknown[]) => {
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
            onChange(newOpenTabs);
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
                data-analytics-nav={analyticsNav}
            >
                {
                    items.map((item) =>
                        item.inline || <Item
                          analytics={!!analyticsNav}
                          key={item.title}
                          {...item}
                          checkChevronDirection={chevronDirection}
                        />
                    )
                }
            </Accordion>
        </div>
    );
}
