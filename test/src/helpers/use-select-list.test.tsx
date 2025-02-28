import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import useSelectList from '~/helpers/use-select-list';

describe('useSelectList', () => {
    const acceptFn = jest.fn();
    const preventDefault = () => undefined;

    function Component() {
        const [activeI, handler] = useSelectList({
            getItems: () => [
                {label: 'first', value: 'first'},
                {label: 'second', value: 'second'}
            ],
            accept: acceptFn
        });

        React.useEffect(
            () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                document.addEventListener('keydown', handler as any);
            },
            [handler]
        );

        return <div>{activeI}</div>;
    }

    it('handles keyboard navigation through list', () => {
        render(<Component />);
        screen.getByText('-1');
        fireEvent.keyDown(document, {key: 'x', preventDefault});
        screen.getByText('-1');
        fireEvent.keyDown(document, {key: 'f', preventDefault});
        screen.getByText('0');
        fireEvent.keyDown(document, {key: 'Escape', preventDefault});
        fireEvent.keyDown(document, {key: 'ArrowDown', preventDefault});
        screen.getByText('1');
        fireEvent.keyDown(document, {key: 'ArrowUp', preventDefault});
        screen.getByText('0');
        fireEvent.keyDown(document, {key: 'ArrowRight', preventDefault});
        screen.getByText('0');
        fireEvent.keyDown(document, {key: 'Enter', preventDefault});
        expect(acceptFn).toHaveBeenCalled();
    });
});
