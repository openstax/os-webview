import React from 'react';
// https://react-spectrum.adobe.com/react-aria/useTabList.html
import {useTabList, useTab, useTabPanel} from 'react-aria';
import {Item, useTabListState} from 'react-stately';
import type {Node} from '@react-types/shared/src/collections';
import './tablist.scss';

type TabsProps = Parameters<typeof useTabListState>[0] &
    Parameters<typeof useTabList>[0];

function Tabs(props: TabsProps) {
    const state = useTabListState(props);
    const ref = React.useRef(null);
    const {tabListProps} = useTabList(props, state, ref);

    return (
        <div className={`tabs ${props.orientation || ''}`}>
            <div {...tabListProps} ref={ref}>
                {[...state.collection].map((item) => (
                    <Tab key={item.key} item={item} state={state} />
                ))}
            </div>
            <TabPanel key={state.selectedItem?.key} state={state} />
        </div>
    );
}

type TabProps = {
    item: Node<unknown>;
    state: ReturnType<typeof useTabListState>;
};

function Tab({item, state}: TabProps) {
    const {key, rendered} = item;
    const ref = React.useRef(null);
    const {tabProps} = useTab({key}, state, ref);

    return (
        <div {...tabProps} ref={ref}>
            {rendered}
        </div>
    );
}

type TabPanelProps = Parameters<typeof useTabPanel>[0] & {
    state: Parameters<typeof useTabPanel>[1];
};

function TabPanel({state, ...props}: TabPanelProps) {
    const ref = React.useRef(null);
    const {tabPanelProps} = useTabPanel(props, state, ref);

    return (
        <div {...tabPanelProps} ref={ref}>
            {state?.selectedItem?.props.children}
        </div>
    );
}

export {Item, Tabs};
