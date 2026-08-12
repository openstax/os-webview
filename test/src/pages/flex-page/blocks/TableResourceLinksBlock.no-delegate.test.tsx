import React from 'react';
import {render} from '@testing-library/preact';
import {LanguageContextProvider} from '~/contexts/language';
import {TableResourceLinksBlock} from '~/pages/flex-page/blocks/TableResourceLinksBlock';
import {blockMap} from '~/pages/flex-page/block-map';
import type {TableBlockConfig} from '~/pages/flex-page/blocks/table-resource-links-utils';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

// Deliberately does NOT mock @openstax/flex-page-renderer/blocks/index: this
// documents today's real state (the renderer version this app currently pins
// has no `table` block) and proves the wrapper doesn't crash the whole page
// while that dependency bump is pending.
describe('TableResourceLinksBlock before the renderer bump lands', () => {
    it('is not registered in blockMap', () => {
        expect('table' in blockMap).toBe(false);
    });

    it('renders nothing rather than crashing when the delegate does not exist', () => {
        mockUseUserContext.mockReturnValue({userStatus: {isInstructor: false}, isVerified: false});
        const data: TableBlockConfig = {
            id: 'table-1',
            type: 'table',
            value: {caption: '', columns: [], rows: [], config: []}
        };

        const {container} = render(
            <LanguageContextProvider>
                <TableResourceLinksBlock data={data} />
            </LanguageContextProvider>
        );

        expect(container.innerHTML).toBe('');
    });
});
