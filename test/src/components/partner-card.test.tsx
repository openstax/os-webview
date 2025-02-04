import React from 'react';
import {render, screen} from '@testing-library/preact';
import PartnerCard from '~/components/partner-card/partner-card';

describe('partner-card', () => {
    function Component() {
        return <PartnerCard
            type={null}
            href='partner-info-url'
            title='partner-name'
            logoUrl={null}
            tags={[]}
            badgeImage='badge-image.jpg'
            verifiedFeatures='feature description'
        />;
    }

    it('has no analytics info if no analyticsContentType', () => {
        render(<Component />);
        const link = screen.getByRole('link');

        expect(link.getAttribute('href')).toBe('partner-info-url');
        expect(link.getAttribute('data-content-type')).toBeNull();
        // name indicates alt text
        screen.getByRole('img', {name: 'verified'});
    });
});
