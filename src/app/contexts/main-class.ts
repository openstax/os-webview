import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [stickyCount, setSticky] = React.useReducer(
        (s: number, a: boolean) => (a ? s + 1 : s - 1),
        0
    );
    const stickyClass = React.useMemo(
        () => (stickyCount > 0 ? 'with-sticky' : ''),
        [stickyCount]
    );
    const [modalClass, setModal] = React.useReducer(
        (s: string, a: boolean) => (a ? 'with-modal' : ''),
        ''
    );
    const classes = React.useMemo(
        () => [stickyClass, modalClass].filter((c) => c),
        [stickyClass, modalClass]
    );

    React.useEffect(() => {
        const bodyClasses = document.body.classList;

        bodyClasses[modalClass === 'with-modal' ? 'add' : 'remove']('with-modal');
    }, [modalClass]);

    return {classes, setSticky, setModal};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as MainClassContextProvider};
