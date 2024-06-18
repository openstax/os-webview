import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import announce, {PageTitleConfirmation} from '~/components/shell/header/announce-page-title';

describe('announce-page-title', () => {
    it('responds to announcement', async () => {
        render(<PageTitleConfirmation />);
        announce('the page');
        await screen.findByText('Loaded page "the page"');
    });
});
