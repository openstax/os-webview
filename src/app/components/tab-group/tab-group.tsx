import React from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './tab-group.scss';

type TabArgs = {
    label: string;
    selectedLabel: string;
    setSelectedLabel: (s: string) => void;
    TabTag: keyof JSX.IntrinsicElements;
    analytics: boolean;
}

function Tab({label, selectedLabel, setSelectedLabel, TabTag, analytics}: TabArgs) {
    const blurAndSetLabel = React.useCallback(
        (event: React.MouseEvent) => {
            (event as React.MouseEvent<HTMLElement>).currentTarget.blur();
            setSelectedLabel(label);
        },
        [setSelectedLabel, label]
    );

    const isSelected = React.useMemo(() =>
        label === selectedLabel
    , [label, selectedLabel]);

    return (
        <TabTag
            role="tab"
            id={ariaTabId(label)}
            aria-controls={ariaPanelId(label)}
            tabIndex={0}
            aria-selected={isSelected}
            onClick={blurAndSetLabel}
            onKeyDown={treatSpaceOrEnterAsClick}
            data-analytics-link={analytics && !isSelected ? '' : undefined}
        >
            {label}
        </TabTag>
    );
}

export function ariaTabId(label: string) {
    return `${label}-tab`;
}

export function ariaPanelId(label: string) {
    return `${label}-panel`;
}

type TabGroupArgs = React.PropsWithChildren<
    Pick<TabArgs, 'selectedLabel' | 'setSelectedLabel' | 'TabTag'> &
    {
        labels: TabArgs['label'][];
        'data-analytics-nav': string;
        listLabel?: string;
    }
>

export default function TabGroup({
    labels, selectedLabel, setSelectedLabel, TabTag='div', children, ...props
}: TabGroupArgs) {
    const analyticsNav = props['data-analytics-nav'];
    const listLabel = props.listLabel ?? 'Tabs';

    return (
        <div className="tab-heading">
            <div className="tabs-and-extras">
                <div
                  role="tablist"
                  aria-label={listLabel}
                  data-analytics-nav={analyticsNav}
                >
                    {labels.map((label) => <Tab
                        key={label}
                        analytics={!!analyticsNav}
                        {...{label, selectedLabel, setSelectedLabel, TabTag}}
                    />)}
                </div>
                {children}
            </div>
            <hr className="tab-baseline" />
        </div>
    );
}
