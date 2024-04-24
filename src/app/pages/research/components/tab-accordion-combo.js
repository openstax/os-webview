import React, {useState} from 'react';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import AccordionGroup from '~/components/accordion-group/accordion-group';

export const DesktopTabs = ({labels, initialSelection, children}) => {
    const [selectedLabel, setSelectedLabel] = useState(labels[initialSelection]);
    const selectedIndex = labels.indexOf(selectedLabel);

    return (
        <div className="desktop-only">
            <TabGroup
                TabTag="div" labels={labels}
                {...{selectedLabel, setSelectedLabel}}
            />
            <ContentGroup activeIndex={selectedIndex} labels={labels}>
                {children}
            </ContentGroup>
        </div>
    );
};

export const TabAccordionCombo = ({children, initialSelection = 0, collapseAll = false}) => {
    const labels = React.Children.map(children, (c) => c.props.label);
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
                <AccordionGroup items={items} preExpanded={collapseAll ? [] : [labels[initialSelection]]} />
            </div>
        </React.Fragment>
    );
};
