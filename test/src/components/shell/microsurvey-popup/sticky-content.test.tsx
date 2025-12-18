import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import useStickyMicrosurveyContent from '~/layouts/default/microsurvey-popup/sticky-content';
import * as SH from '~/layouts/default/shared';
import stickyData from '~/../../test/src/data/sticky-data';

describe('microsurvey-popup/sticky-content', () => {
    function Component() {
        const [ready, StickyContent] = useStickyMicrosurveyContent();

        return ready
            ? <StickyContent><div>the page</div></StickyContent>
            : null;
    }

    function WrappedComponent({path}: {path: string}) {
        return <MemoryRouter initialEntries={[path]}>
            <Component />
        </MemoryRouter>;
    }

    it('renders nothing unless stickydata mode is popup', () => {
        jest.spyOn(SH, 'useStickyData').mockReturnValue({...stickyData, mode: 'banner'});
        render(<WrappedComponent path='/' />);
        expect(document.body.textContent).toBe('');
    });
    it('renders the page if stickydata mode is popup', () => {
        jest.spyOn(SH, 'useStickyData').mockReturnValue({...stickyData, mode: 'popup'});
        render(<WrappedComponent path='/' />);
        screen.getByText('Make a difference now');
    });
});
