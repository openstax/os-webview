import React, {useRef, useLayoutEffect} from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './tab-group.scss';

function Tab({label, selectedLabel, setSelectedLabel, TabTag, analytics}) {
    const ref = useRef();
    const blurAndSetLabel = React.useCallback(
        (event) => {
            event.currentTarget.blur();
            setSelectedLabel(label);
        },
        [setSelectedLabel, label]
    );

    const isSelected = React.useMemo(() =>
        label === selectedLabel
    , [label, selectedLabel]);

    // Couldn't get this to work as a normal attribute expression;
    // it would not remove the aria-current attribute, only its value
    useLayoutEffect(() => {
        if (isSelected) {
            ref.current.setAttribute('aria-current', 'page');
        } else {
            ref.current.removeAttribute('aria-current');
        }
    }, [isSelected]);

    return (
        <TabTag
            ref={ref}
            className="tab"
            role="link" tabIndex="0"
            onClick={blurAndSetLabel}
            onKeyDown={treatSpaceOrEnterAsClick}
            data-analytics-link={analytics && !isSelected ? '' : undefined}
        >
            {label}
        </TabTag>
    );
}

export default function TabGroup({
    labels, selectedLabel, setSelectedLabel, TabTag='div', children, ...props
}) {
    const analyticsNav = props['data-analytics-nav'];

    return (
        <div className="tab-heading">
            <div className="tabs-and-extras">
                <nav
                  className="tab-group"
                  data-analytics-nav={analyticsNav}
                >
                    {labels.map((label) => <Tab
                        key={label}
                        analytics={!!analyticsNav}
                        {...{label, selectedLabel, setSelectedLabel, TabTag}}
                    />)}
                </nav>
                {children}
            </div>
            <hr className="tab-baseline" />
        </div>
    );
}
