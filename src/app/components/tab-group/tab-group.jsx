import React, {useRef, useLayoutEffect} from 'react';
import $ from '~/helpers/$';
import './tab-group.scss';

function Tab({label, selectedLabel, setSelectedLabel, TabTag}) {
    const ref = useRef();

    // Couldn't get this to work as a normal attribute expression;
    // it would not remove the aria-current attribute, only its value
    useLayoutEffect(() => {
        if (label === selectedLabel) {
            ref.current.setAttribute('aria-current', 'page');
        } else {
            ref.current.removeAttribute('aria-current');
        }
    }, [label, selectedLabel]);

    function onClick(event) {
        event.currentTarget.blur();
        setSelectedLabel(label);
    }

    return (
        <TabTag
            ref={ref}
            className="tab"
            role="link" tabIndex="0"
            onClick={onClick}
            onKeyDown={$.treatSpaceOrEnterAsClick}
        >
            {label}
        </TabTag>
    );
}

export default function TabGroup({
    labels, selectedLabel, setSelectedLabel, TabTag='div', children
}) {
    return (
        <div className="tab-heading">
            <div className="tabs-and-extras">
                <nav className="tab-group">
                    {labels.map((label) => <Tab key={label} {...{label, selectedLabel, setSelectedLabel, TabTag}} />)}
                </nav>
                {children}
            </div>
            <hr className="tab-baseline" />
        </div>
    );
}
