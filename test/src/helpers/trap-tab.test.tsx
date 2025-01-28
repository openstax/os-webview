import React from 'react';
import {render, fireEvent} from '@testing-library/preact';
import trapTab from '~/helpers/trap-tab';

describe('trap-tab', () => {
    function Component() {
        const ref = React.useRef(null);

        React.useEffect(() => {
            const tabListener = trapTab(ref.current);

            document.addEventListener('keydown', tabListener, true);
            return () => window.removeEventListener('keydown', tabListener, true);
        }, []);

        return <div ref={ref}>
            <input type="text" name="first" />
            <div>not focusable</div>
            <input type="text" name="second" />
            <button name="third">Last element</button>
        </div>;
    }
    const tabPressEvent = {
        key: 'Tab',
        shiftKey: false
    } as object as KeyboardEvent;

    it('ignores event if there is no element', () => {
        const handler = trapTab(null);

        expect(() => handler(tabPressEvent)).not.toThrow();
    });
    it('ignores event if there are no focusable elements', () => {
        render(<div id="no-elements" />);
        const handler = trapTab(document.getElementById('no-elements'));

        expect(() => handler(tabPressEvent)).not.toThrow();
    });
    // Can't test normal built-in tab navigation; only wrap-around
    it('wraps around forward', () => {
        render(<Component />);

        document.querySelector<HTMLInputElement>('[name="third"]')?.focus();
        fireEvent.keyDown(document, tabPressEvent);
        expect(document.activeElement?.getAttribute('name')).toBe('first');
    });
    it('wraps around backward', () => {
        render(<Component />);

        document.querySelector<HTMLInputElement>('[name="first"]')?.focus();
        fireEvent.keyDown(document, {...tabPressEvent, shiftKey: true});
        expect(document.activeElement?.getAttribute('name')).toBe('third');
    });
});
