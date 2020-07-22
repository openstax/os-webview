import React, {useState, useEffect, useLayoutEffect} from 'react';
import $ from '~/helpers/$';
import {usePageData} from '~/helpers/controller/cms-mixin';
import throttle from 'lodash/throttle';

function getValuesFromWindow() {
    const {innerHeight, innerWidth, scrollY} = window;

    return {innerHeight, innerWidth, scrollY};
}

export const WindowContext = React.createContext(getValuesFromWindow());

export function WindowContextProvider({children}) {
    const [value, setValue] = useState(getValuesFromWindow());

    useLayoutEffect(() => {
        const handleScroll = () => setValue(getValuesFromWindow());

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <WindowContext.Provider value={value}>
            {children}
        </WindowContext.Provider>
    );
}

export function LoaderPage({slug, Child, props={}}) {
    const [data, statusPage] = usePageData({slug, setsPageTitleAndDescription: false});

    if (statusPage) {
        return statusPage;
    }

    return (
        <Child {...{data, ...props}} />
    );
}

export function useDataFromPromise(promise, defaultValue) {
    const [data, setData] = useState(defaultValue);

    useEffect(() => {
        promise.then(setData);
    }, []);

    return data;
}

export function useCanonicalLink(controlsHeader=true) {
    useEffect(() => {
        if (!controlsHeader) {
            return null;
        }
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);
}

export const ActiveElementContext = React.createContext(document.activeElement);

    if (statusPage) {
        return statusPage;
    }

    return (
        <Child {...{data, ...props}} />
    );
}

export function useDataFromPromise(promise, defaultValue) {
    const [data, setData] = useState(defaultValue);

    useEffect(() => {
        promise.then(setData);
    }, []);

    return data;
}

export function useCanonicalLink(controlsHeader=true) {
    useEffect(() => {
        if (!controlsHeader) {
            return null;
        }
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);
}

export function createPageContextProvider({Context, slug}) {
    return function ({children}) {
        const [data, statusPage] = usePageData({slug});

        return (
            <Context.Provider value={data}>
                {children}
            </Context.Provider>
        );
    };
}

export function RawHTML({Tag='div', html, ...otherProps}) {
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} />
    );
}

export function useSelectList({
    getItems, accept,
    cancel = () => null, minActiveIndex = 0, searchable = true
}) {
    const [activeIndex, setActiveIndex] = useState(-1);

    // eslint-disable-next-line complexity
    function handleKeyDown(event) {
        let handled = true;
        const items = getItems();

        switch (event.key) {
        case 'Enter':
        case ' ':
            if (activeIndex > -1) {
                accept(items[activeIndex]);
                setActiveIndex(-1);
            } else {
                handled = false;
            }
            // eslint-disable-next-line no-fallthrough
        case 'Escape':
            cancel();
            break;
        case 'ArrowDown':
            setActiveIndex(Math.min(
                Math.max(activeIndex + 1, minActiveIndex),
                items.length - 1)
            );
            break;
        case 'ArrowUp':
            setActiveIndex(Math.max(activeIndex - 1, minActiveIndex));
            break;
        default:
            if (searchable && event.key.length === 1) {
                const letter = event.key.toLowerCase();
                const values = Array.from(items)
                    .map((opt) => opt.textContent.toLowerCase());
                let foundIndex = values.findIndex((val, i) =>
                    i > activeIndex && val.startsWith(letter)
                );

                if (!(foundIndex > -1)) {
                    foundIndex = values.findIndex((val) => val.startsWith(letter));
                }
                if (foundIndex > -1) {
                    setActiveIndex(foundIndex);
                }
            } else {
                handled = false;
            }
        }

        return handled;
    }

    return [activeIndex, handleKeyDown, setActiveIndex];
}
