import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import useMainClassContext, {MainClassContextProvider} from '~/contexts/main-class';

function Component() {
    const {setModal} = useMainClassContext();

    React.useEffect(() => {
        setModal(true);
        setTimeout(() => setModal(false), 50);
    });

    return null;
}

jest.useFakeTimers();
describe('contexts/main-class', () => {
    it('adds and removes with-modal class', async () => {
        render(
            <MainClassContextProvider>
                <Component />
            </MainClassContextProvider>
        );
        await waitFor(() => expect(document.body.classList.contains('with-modal')).toBe(true));
        jest.runAllTimers();
        await waitFor(() => expect(document.body.classList.contains('with-modal')).toBe(false));
    });
});
