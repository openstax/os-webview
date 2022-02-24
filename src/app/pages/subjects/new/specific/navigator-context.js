/*
    Specs
    1. Navigator listens to scroll and resize events to determine which of its
    linked elements is closest to the middle of the viewport
    2. Context includes "goTo" that scrolls the indicated linked element to the
    middle of the viewport
    3. Navigator has state variable for the ID of the linked element closest to
    the middle of the viewport
*/
import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useWindowContext from '~/contexts/window';

function idListReducer(state, action) {
    switch (action.type) {
    case 'register':
        if (!state.includes(action.id)) {
            return [...state, action.id];
        }
        break;
    case 'unregister':
        if (state.includes(action.id)) {
            return state.filter((i) => i !== action.id);
        }
        break;
    default: break;
    }
    return [];
}

function useContextValue() {
    const [idList, dispatch] = React.useReducer(idListReducer, []);
    const registerId = React.useCallback(
        (id) => {
            dispatch({type: 'register', id});
        },
        []
    );
    const unregisterId = React.useCallback(
        (id) => {
            dispatch({type: 'unregister', id});
        },
        []
    );
    const goTo = React.useCallback(
        (id) => {
            const target = document.getElementById(id);

            if (target) {
                target.scrollIntoView({block: 'center', behavior: 'smooth'});
            } else {
                console.warn('Target not found', id);
            }
        },
        []
    );
    const wCtx = useWindowContext();
    const currentId = React.useMemo(
        () => {
            const midY = wCtx.innerHeight / 2;

            return idList.find(
                (id) => {
                    const el = document.getElementById(id);

                    if (! el) {
                        console.info('Did not find', id);
                        return null;
                    }
                    const {top, bottom} = el.getBoundingClientRect();

                    return top < midY && bottom > midY;
                }
            );
        },
        [wCtx, idList]
    );

    return {registerId, goTo, currentId, unregisterId};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as NavigatorContextProvider
};
