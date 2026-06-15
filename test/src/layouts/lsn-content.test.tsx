import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import LsnContent from '~/layouts/default/lower-sticky-note/lsn-content';
import type {BannerInfo} from '~/layouts/default/shared';

/* eslint-disable camelcase */
function makeBanner(overrides: Partial<BannerInfo> = {}): BannerInfo {
    return {
        id: 1,
        name: 'Spring Campaign A',
        html_message: 'This is an <strong>awesome</strong> banner!',
        link_text: 'Give Today',
        link_url: 'https://riceconnect.rice.edu/give',
        is_active: true,
        start_date: null,
        end_date: null,
        context_filter: 'all',
        url_pattern: null,
        ...overrides
    };
}
/* eslint-enable camelcase */

function PutAway() {
    return <button>dismiss</button>;
}

describe('lsn-content', () => {
    it('renders the image variant when a thumbnail is set', () => {
        const banner = makeBanner({
            banner_thumbnail: 'https://example.com/thumb.png' // eslint-disable-line camelcase
        });

        const {container} = render(<LsnContent bannerInfo={banner} PutAway={PutAway} />);

        expect(container.querySelector('.lower-sticky-note-content')).toHaveClass('with-image');
        expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/thumb.png');
        expect(screen.getByRole('link', {name: /Give Today/})).toHaveAttribute('href', 'https://riceconnect.rice.edu/give');
    });

    it('renders the no-image variant when no thumbnail is set', () => {
        const banner = makeBanner();
        const {container} = render(<LsnContent bannerInfo={banner} PutAway={PutAway} />);

        expect(container.querySelector('.lower-sticky-note-content')).not.toHaveClass('with-image');
        expect(container.querySelector('img')).toBeNull();
        screen.getByRole('link', {name: /Give Today/});
    });

    it('omits the CTA link when link_url is missing', () => {
        const banner = makeBanner({link_url: null}); // eslint-disable-line camelcase

        render(<LsnContent bannerInfo={banner} PutAway={PutAway} />);
        expect(screen.queryByRole('link')).toBeNull();
    });

    it('omits the CTA link when link_text is missing', () => {
        const banner = makeBanner({link_text: null}); // eslint-disable-line camelcase

        render(<LsnContent bannerInfo={banner} PutAway={PutAway} />);
        expect(screen.queryByRole('link')).toBeNull();
    });

    it('tags the container with the variant name for analytics', () => {
        const banner = makeBanner({name: 'Variant B'});
        const {container} = render(<LsnContent bannerInfo={banner} PutAway={PutAway} />);

        expect(container.querySelector('[data-banner-variant="Variant B"]')).not.toBeNull();
    });

    it('renders the PutAway dismiss control', () => {
        render(<LsnContent bannerInfo={makeBanner()} PutAway={PutAway} />);
        screen.getByRole('button', {name: 'dismiss'});
    });
});
