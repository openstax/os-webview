import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import $ from '~/helpers/$';
import SkipToContent, {
    useSkipTargetFocus
} from '~/components/shell/skip-to-content';

jest.mock('~/helpers/$', () => ({
    __esModule: true,
    default: {
        scrollTo: jest.fn()
    }
}));

// Stands in for a layout's Main: renders #main and claims the focus the skip
// link asked for, which is the wiring both real layouts have.
function MainRegion() {
    useSkipTargetFocus();

    return (
        <div id="main" tabIndex={-1}>
            main content
        </div>
    );
}

describe('skip-to-content target', () => {
    afterEach(() => {
        window.location.hash = '';
        jest.clearAllMocks();
    });

    it('claims focus when the link asked for it', () => {
        window.location.hash = '#main';

        render(<MainRegion />);

        const mainEl = document.getElementById('main');

        expect(document.activeElement).toBe(mainEl);
        expect($.scrollTo).toHaveBeenCalledWith(mainEl);
    });

    it('claims focus off the link itself', () => {
        window.location.hash = '#main';

        render(<SkipToContent />);
        // Where a keyboard user is left standing when the click fell through
        // to the browser and #main did not exist yet.
        screen.getByText('skip to main content').focus();

        render(<MainRegion />);

        expect(document.activeElement).toBe(document.getElementById('main'));
    });

    it('leaves focus alone when the user has moved on', () => {
        window.location.hash = '#main';

        render(<button type="button">elsewhere</button>);

        const button = screen.getByText('elsewhere');

        button.focus();

        render(<MainRegion />);

        expect(document.activeElement).toBe(button);
    });

    it('does nothing when the skip link was not the way in', () => {
        render(<MainRegion />);

        expect(document.activeElement).toBe(document.body);
        expect($.scrollTo).not.toHaveBeenCalled();
    });
});
