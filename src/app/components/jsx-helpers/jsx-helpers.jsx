import React, {useState, useLayoutEffect} from 'react';
import throttle from 'lodash/throttle';

function getValuesFromWindow() {
    const {innerHeight, innerWidth, scrollY} = window;

    return {innerHeight, innerWidth, scrollY};
}

export const WindowContext = React.createContext(getValuesFromWindow());

export function WindowContextProvider({children}) {
    const [value, setValue] = useState(getValuesFromWindow());

    useLayoutEffect(() => {
        const handleScroll = throttle(() => setValue(getValuesFromWindow()), 40);

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
        <ActiveElementContext.Provider value={value}>
            {children}
        </ActiveElementContext.Provider>
    );
}

export function RawHTML({Tag='div', html, ...otherProps}) {
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} />
    );
}
