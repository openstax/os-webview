import React from 'react';
import {render, fireEvent} from '@testing-library/preact';
import Toggle, {IfToggleIsOpen, useRefToFocusAfterClose} from '~/components/toggle/toggle';
import ToggleControlBar, {getListboxId} from '~/components/toggle/toggle-control-bar';

// toggle-control-bar.tsx/toggle.tsx have no dedicated test of their own -
// they're normally only covered incidentally by consumer components
// (drop-down, book-tags, subject navigator), and the real toggle-context's
// throttled (125ms, trailing:false) toggle() makes exercising every state
// transition from a consumer test timing-dependent and flaky. Mock the
// context here so isOpen/toggle/close are fully controlled per test.
const mockUseToggleContext = jest.fn();

jest.mock('~/components/toggle/toggle-context', () => ({
    ...jest.requireActual('~/components/toggle/toggle-context'),
    __esModule: true,
    default: () => mockUseToggleContext()
}));

describe('Toggle', () => {
    it('renders its children inside the toggle context provider', () => {
        const {getByText} = render(<Toggle>hello</Toggle>);

        expect(getByText('hello')).toBeTruthy();
    });
});

describe('IfToggleIsOpen', () => {
    it('renders children when open', () => {
        mockUseToggleContext.mockReturnValue({isOpen: true});
        const {getByText} = render(<IfToggleIsOpen>visible</IfToggleIsOpen>);

        expect(getByText('visible')).toBeTruthy();
    });

    it('renders nothing when closed', () => {
        mockUseToggleContext.mockReturnValue({isOpen: false});
        const {container} = render(<IfToggleIsOpen>hidden</IfToggleIsOpen>);

        expect(container.textContent).toBe('');
    });
});

function FocusHarness() {
    const ref = useRefToFocusAfterClose();

    return <div ref={ref} tabIndex={0} data-testid="focus-target">target</div>;
}

describe('useRefToFocusAfterClose', () => {
    it('does nothing on an initial mount that starts closed', () => {
        mockUseToggleContext.mockReturnValue({isOpen: false});
        const {getByTestId} = render(<FocusHarness />);

        expect(document.activeElement).not.toBe(getByTestId('focus-target'));
    });

    it('focuses the ref once closed after having been opened', () => {
        mockUseToggleContext.mockReturnValue({isOpen: true});
        const {rerender, getByTestId} = render(<FocusHarness />);

        mockUseToggleContext.mockReturnValue({isOpen: false});
        rerender(<FocusHarness />);

        expect(document.activeElement).toBe(getByTestId('focus-target'));
    });
});

describe('getListboxId', () => {
    it('returns an lbid-prefixed id', () => {
        expect(getListboxId()).toMatch(/^lbid-\d+$/);
    });
});

describe('ToggleControlBar', () => {
    const Indicator = ({isOpen}: {isOpen: boolean}) => <span>{isOpen ? 'open' : 'closed'}</span>;

    it('omits aria-haspopup/aria-controls when no listboxId is given', () => {
        mockUseToggleContext.mockReturnValue({isOpen: false, toggle: jest.fn()});
        const {getByRole} = render(<ToggleControlBar Indicator={Indicator}>label</ToggleControlBar>);

        expect(getByRole('combobox').getAttribute('aria-haspopup')).toBeNull();
    });

    it('sets aria-haspopup/aria-controls when a listboxId is given', () => {
        mockUseToggleContext.mockReturnValue({isOpen: false, toggle: jest.fn()});
        const {getByRole} = render(
            <ToggleControlBar Indicator={Indicator} listboxId="my-listbox">label</ToggleControlBar>
        );
        const combobox = getByRole('combobox');

        expect(combobox.getAttribute('aria-haspopup')).toBe('listbox');
        expect(combobox.getAttribute('aria-controls')).toBe('my-listbox');
    });

    it('calls toggle() on click', () => {
        const toggle = jest.fn();

        mockUseToggleContext.mockReturnValue({isOpen: false, toggle});
        const {getByRole} = render(<ToggleControlBar Indicator={Indicator}>label</ToggleControlBar>);

        fireEvent.click(getByRole('combobox'));
        expect(toggle).toHaveBeenCalled();
    });

    it('treats a qualifying keydown as a click while open (Escape is in the open key list)', () => {
        const toggle = jest.fn();

        mockUseToggleContext.mockReturnValue({isOpen: true, toggle});
        const {getByRole} = render(<ToggleControlBar Indicator={Indicator}>label</ToggleControlBar>);

        fireEvent.keyDown(getByRole('combobox'), {key: 'Escape'});
        expect(toggle).toHaveBeenCalled();
    });

    it('ignores a non-qualifying keydown while closed', () => {
        const toggle = jest.fn();

        mockUseToggleContext.mockReturnValue({isOpen: false, toggle});
        const {getByRole} = render(<ToggleControlBar Indicator={Indicator}>label</ToggleControlBar>);

        fireEvent.keyDown(getByRole('combobox'), {key: 'Escape'});
        expect(toggle).not.toHaveBeenCalled();
    });

    it('restores focus to a child input once closed after having been opened', () => {
        mockUseToggleContext.mockReturnValue({isOpen: true, toggle: jest.fn()});
        const {rerender, getByRole} = render(
            <ToggleControlBar Indicator={Indicator}><input aria-label="filter" /></ToggleControlBar>
        );

        mockUseToggleContext.mockReturnValue({isOpen: false, toggle: jest.fn()});
        rerender(<ToggleControlBar Indicator={Indicator}><input aria-label="filter" /></ToggleControlBar>);

        expect(document.activeElement).toBe(getByRole('textbox'));
    });

    it('restores focus to the control bar itself once closed after opened, with no child input', () => {
        mockUseToggleContext.mockReturnValue({isOpen: true, toggle: jest.fn()});
        const {rerender, getByRole} = render(
            <ToggleControlBar Indicator={Indicator}><span>label</span></ToggleControlBar>
        );

        mockUseToggleContext.mockReturnValue({isOpen: false, toggle: jest.fn()});
        rerender(<ToggleControlBar Indicator={Indicator}><span>label</span></ToggleControlBar>);

        expect(document.activeElement).toBe(getByRole('combobox'));
    });
});
