import React from 'react';
import {render} from '@testing-library/preact';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

describe('LoadingPlaceholder', () => {
    it('renders without the full-page modifier by default', () => {
        const {container} = render(<LoadingPlaceholder />);

        expect(container.querySelector('.os-loader')).toBeTruthy();
        expect(container.querySelector('.os-loader--full-page')).toBeFalsy();
    });

    it('adds the full-page modifier when asked', () => {
        const {container} = render(<LoadingPlaceholder fullPage />);

        expect(container.querySelector('.os-loader--full-page')).toBeTruthy();
    });
});
