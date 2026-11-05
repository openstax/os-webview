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
import './accordion-group.scss';

type FunctionOrFalse = false | ((n: string[]) => void);

function useChevronDirection(
    forwardOnChange: FunctionOrFalse,
    preExpanded: string[]
) {
    const [openTabs, updateOpenTabs] = React.useState([...preExpanded]);
    const chevronDirection = React.useCallback(
        (uuid: string) => (openTabs.includes(uuid) ? 'up' : 'down'),
        [openTabs]
    );
    const onChange = React.useCallback(
        (newOpenTabs: string[]) => {
            if (forwardOnChange) {
                forwardOnChange(newOpenTabs);
            }
            updateOpenTabs(newOpenTabs);
        },
        [forwardOnChange, updateOpenTabs]
    );

    return [chevronDirection, onChange] as const;
}

type ChevronDirection = 'up' | 'down';

function TitleBar({
    title,
    titleTag,
    chevronDirection,
    analytics
}: {
    title: string;
    titleTag?: string;
    chevronDirection: ChevronDirection;
    analytics?: boolean;
}) {
    const icon = {
        down: faChevronDown,
        up: faChevronUp
    }[chevronDirection];
    const isOpen = chevronDirection === 'up';

    return (
        <AccordionItemHeading aria-level="2">
            <AccordionItemButton
                className="accordion-button"
                data-analytics-link={analytics && !isOpen ? '' : undefined}
            >
                <div className="label">
                    {title}
                    {titleTag && <span className="title-tag">{titleTag}</span>}
                </div>
                <div className="chevron">
                    <FontAwesomeIcon icon={icon} />
                </div>
            </AccordionItemButton>
        </AccordionItemHeading>
    );
}

// A blank title cleans to '', which react-accessible-accordion rejects at
// runtime ("uuid must be a valid HTML5 id"), so fall back to the item's
// position. Keep the fallback format consistent with the cleaning regex so
// values returned from onChange can be passed back via preExpanded.
function toUuid(name: string, index: number) {
    return name.replace(/\W+/g, '_') || `item_${index}`;
}

function Item({
    title,
    titleTag,
    checkChevronDirection,
    contentComponent,
    analytics,
    index
}: Omit<Parameters<typeof TitleBar>[0], 'chevronDirection'> & {
    contentComponent: React.ReactNode;
    checkChevronDirection: (u: string) => ChevronDirection;
    index: number;
}) {
    const uuid = toUuid(title, index);
    const chevronDirection = checkChevronDirection(uuid);

    return (
        <AccordionItem uuid={uuid} className="accordion-item">
            <TitleBar
                {...{
                    title,
                    titleTag,
                    chevronDirection,
                    analytics
                }}
            />
            <AccordionItemPanel className="content-pane">
                {contentComponent}
            </AccordionItemPanel>
        </AccordionItem>
    );
}

type ItemType = {
    title: string;
    contentComponent: React.ReactNode;
} | {
    inline: React.ReactNode;
};

export default function AccordionGroup({
    items,
    accordionProps = {allowZeroExpanded: true},
    noScroll = false,
    forwardOnChange = false,
    preExpanded = [],
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
    const preExpandedUuids = preExpanded.map((name, i) => toUuid(name, i));
    const [chevronDirection, onChange] = useChevronDirection(
        forwardOnChange,
        preExpandedUuids
    );
    const scrollAndChangeChevronPlus = React.useCallback(
        (newOpenTabs: string[]) => {
            if (!noScroll) {
                window.setTimeout(() => {
                    const openItem = root.current?.querySelector(
                        '[aria-expanded="true"]'
                    );

                    if (openItem) {
                        $.scrollTo(openItem);
                    }
                }, 20);
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
                {items.filter((i) => 'title' in i).map(
                    (item, index) => (
                        <Item
                            analytics={!!analyticsNav}
                            key={item.title || index}
                            {...item}
                            index={index}
                            checkChevronDirection={chevronDirection}
                        />
                    )
                )}
            </Accordion>
        </div>
    );
}
