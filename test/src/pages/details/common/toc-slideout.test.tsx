import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import TOCSlideout from '~/pages/details/common/toc-slideout/toc-slideout';

describe('details/TOC Slideout', () => {
    const user = userEvent.setup();

    it('opens and closes', async () => {
        render(
            <TOCContextProvider>
                <TOCSlideout html="<ol><li>one</li><li>two</li></ol>" />
            </TOCContextProvider>
        );

        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
        await user.click(screen.getByRole('button'));
        expect(screen.queryAllByRole('listitem')).toHaveLength(2);
        await user.click(screen.getByRole('button'));
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
});
