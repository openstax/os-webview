import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import announce, {PageTitleConfirmation} from '~/components/shell/announce-page-title';

describe('announce-page-title', () => {
    it('responds to announcement', async () => {
        render(<PageTitleConfirmation />);
        announce('the page');
        await screen.findByText('Loaded page "the page"');
    });
});
