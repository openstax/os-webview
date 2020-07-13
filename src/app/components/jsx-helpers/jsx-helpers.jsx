import React, {useState, useLayoutEffect} from 'react';

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

export function RawHTML({Tag='div', html, ...otherProps}) {
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} />
    );
}
