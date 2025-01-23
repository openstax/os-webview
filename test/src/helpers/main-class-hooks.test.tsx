import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import {useMainModal} from '~/helpers/main-class-hooks';
import {MainClassContextProvider} from '~/contexts/main-class';

/* eslint-disable max-nested-callbacks */
describe('main-class-hooks', () => {
    describe('useMainModal', () => {
        function Inner() {
            useMainModal();

            return null;
        }
        function Component() {
            const [show, setShow] = React.useState(true);

            React.useEffect(() => {
                setTimeout(() => setShow(false), 50);
            }, []);

            return show ? <Inner /> : null;
        }
        jest.useFakeTimers();
        it('sets modal to true at init; to false at teardown', async () => {
            render(
                <MainClassContextProvider>
                    <Component />
                </MainClassContextProvider>
            );

            await waitFor(() =>
                expect(document.body.classList.contains('with-modal')).toBe(
                    true
                )
            );
            jest.runAllTimers();
            await waitFor(() =>
                expect(document.body.classList.contains('with-modal')).toBe(
                    false
                )
            );
        });
    });
});
