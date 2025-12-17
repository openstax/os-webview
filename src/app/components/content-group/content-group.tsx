import React from 'react';
import {ariaTabId, ariaPanelId} from '~/components/tab-group/tab-group';

export default function ContentGroup({
    activeIndex,
    labels,
    children
}: React.PropsWithChildren<{
    activeIndex: number;
    labels: string[];
}>) {
    return (
        <div className="content-group">
            {React.Children.map(children, (child, i) => (
                <Panel label={labels[i] ?? ''} key={i} active={activeIndex === i}>
                    {child}
                </Panel>
            ))}
        </div>
    );
}

function Panel({
    label,
    active,
    children
}: React.PropsWithChildren<{label: string; active: boolean}>) {
    const id = ariaPanelId(label);
    const tabId = ariaTabId(label);

    return (
        <div id={id} aria-labelledby={tabId} hidden={!active} role="tabpanel">
            {children}
        </div>
    );
}
