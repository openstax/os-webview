import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import $ from '~/helpers/$';
import {usePageData, fetchFromCMS} from '~/helpers/controller/cms-mixin';
import throttle from 'lodash/throttle';
import useRouterContext from '~/components/shell/router-context';

export function useDataFromPromise(promise, defaultValue) {
    const [data, setData] = useState(defaultValue);

    useEffect(() => {
        if (promise) {
            promise.then(setData);
        }
    }, [promise]);

    return data;
}

export function useDataFromSlug(slug, preserveWrapping=false) {
    const [data, setData] = useState();

    useEffect(() => {
        fetchFromCMS(slug, preserveWrapping).then(setData);
    }, [slug, preserveWrapping]);

    return data;
}

export function useCanonicalLink(controlsHeader=true) {
    useEffect(() => {
        if (!controlsHeader) {
            return null;
        }
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, [controlsHeader]);
}

export function LoaderPage({
    slug, Child, props={}, preserveWrapping, doDocumentSetup=false,
    noCamelCase=false
}) {
    const [data, statusPage] = usePageData({slug, setsPageTitleAndDescription: false, preserveWrapping});
    const {fail} = useRouterContext();

    useCanonicalLink(doDocumentSetup);
    useEffect(() => {
        if (!statusPage && doDocumentSetup) {
            $.setPageTitleAndDescriptionFromBookData(data);
        }
    });
    if (data && data.error) {
        fail();
    }
    if (statusPage) {
        return statusPage;
    }

    const camelCaseData = noCamelCase ? data : $.camelCaseKeys(data);

    return (
        <Child {...{data: camelCaseData, ...props}} />
    );
}

export const ActiveElementContext = React.createContext(document.activeElement);

export function ActiveElementContextProvider({children}) {
    const [value, setValue] = useState(document.activeElement);
    const handler = () => {
        setValue(document.activeElement);
    };
    const blurHandler = ({relatedTarget}) => {
        if (!relatedTarget) {
            setValue(document.activeElement);
        }
    };

    useLayoutEffect(() => {
        document.addEventListener('focus', handler, true);
        document.addEventListener('blur', blurHandler, true);

        return () => {
            document.removeEventListener('focus', handler, true);
            document.removeEventListener('blur', blurHandler, true);
        };
    }, []);

    return (
        <ActiveElementContext.Provider value={value} children={children} />
    );
}

export function RawHTML({Tag='div', html, embed=false, ...otherProps}) {
    const ref=useRef();

    useEffect(() => {
        if (embed) {
            $.activateScripts(ref.current);
        }
    });
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} ref={ref} />
    );
}

export function useToggle(initialState) {
    return React.useReducer((state, newValue=!state) => newValue, initialState);
}

export function useSet(initialValue=[]) {
    const setRef = useRef(new window.Set(initialValue));
    const set = setRef.current;
    const [handle, setHandle] = useState({
        add(newValue) {
            set.add(newValue);
            setHandle({...handle});
        },
        delete(oldValue) {
            set.delete(oldValue);
            setHandle({...handle});
        },
        has(v) {
            return set.has(v);
        },
        values() {
            return set.values();
        }
    });

    return handle;
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
                    .map((opt) => opt.label.toLowerCase());
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
