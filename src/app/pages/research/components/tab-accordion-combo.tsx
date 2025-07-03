import React from 'react';
import {Tabs, Item} from '~/components/tablist/tablist';
import AccordionGroup from '~/components/accordion-group/accordion-group';

export const DesktopTabs = ({
    labels,
    initialSelection,
    children
}: {
    labels: string[];
    initialSelection: number;
    children: React.ReactElement[];
}) => {
    return (
        <div className="desktop-only">
            <Tabs
                aria-label="Research focus tabs"
                defaultSelectedKey={labels[initialSelection]}
            >
                {labels.map((label, i) => (
                    <Item key={label} title={label}>
                        {children[i]}
                    </Item>
                ))}
            </Tabs>
        </div>
    );
};

export const TabAccordionCombo = ({
    children,
    initialSelection = 0,
    collapseAll = false
}: {
    initialSelection?: number;
    collapseAll?: boolean;
    children: React.ReactElement[];
}) => {
    const labels = React.Children.map(
        children,
        (c) => c.props.label
    ) as string[];
    const items = React.Children.map(children, (child, i) => ({
        title: labels[i],
        contentComponent: child
    }));

    return (
        <React.Fragment>
            <DesktopTabs labels={labels} initialSelection={initialSelection}>
                {children}
            </DesktopTabs>
            <div className="mobile-only">
                <AccordionGroup
                    items={items}
                    preExpanded={collapseAll ? [] : [labels[initialSelection]]}
                />
            </div>
        </React.Fragment>
    );
};
