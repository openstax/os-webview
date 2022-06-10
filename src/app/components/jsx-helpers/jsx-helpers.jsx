import React, {useState, useRef, useEffect} from 'react';
import $ from '~/helpers/$';
import {usePageData, fetchFromCMS} from '~/helpers/controller/cms-mixin';
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
        if (slug) {
            fetchFromCMS(slug, preserveWrapping).then(setData);
        }
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
    }, [data, statusPage, doDocumentSetup]);

    if (data?.error && fail) {
        fail(`Could not load ${slug}`);
    }
    if (statusPage) {
        return statusPage;
    }

    const camelCaseData = noCamelCase ? data : $.camelCaseKeys(data);

    return (
        <Child {...{data: camelCaseData, ...props}} />
    );
}

// Making scripts work, per https://stackoverflow.com/a/47614491/392102
function activateScripts(el) {
    const scripts = Array.from(el.querySelectorAll('script'));
    const processOne = (() => {
        if (scripts.length === 0) {
            return;
        }
        const s = scripts.shift();
        const newScript = document.createElement('script');
        const p = (s.src) ? new Promise((resolve) => {
            newScript.onload = resolve;
        }) : Promise.resolve();

        Array.from(s.attributes)
            .forEach((a) => newScript.setAttribute(a.name, a.value));
        newScript.appendChild(document.createTextNode(s.textContent));
        newScript.async = false;
        s.parentNode?.replaceChild(newScript, s);

        p.then(processOne);
    });

    processOne();
}

export function RawHTML({Tag='div', html, embed=false, ...otherProps}) {
    const ref=useRef();

    useEffect(() => {
        if (embed) {
            activateScripts(ref.current);
        }
    });
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} ref={ref} />
    );
}

export function useToggle(initialState) {
    return React.useReducer((state, newValue=!state) => newValue, initialState);
}

// Returns [value, refresh]
export function useRefreshable(getter) {
    return React.useReducer(getter, getter());
}

// Returns [value, updateValue]
export function useSettable(getter, setter) {
    return React.useReducer(
        (_, payload) => {
            setter(payload);
            return getter();
        },
        getter()
    )
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
                event.preventDefault();
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
