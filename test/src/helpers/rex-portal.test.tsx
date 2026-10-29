import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {useRexPortalLinkOrNot} from '~/helpers/rex-portal';
import * as PC from '~/contexts/portal';

const rexLink = 'https://openstax.org/books/algebra-1/pages/quick-start';

function mockPortal(portalPrefix: string, isK12Portal: boolean) {
    jest.spyOn(PC, 'default').mockReturnValue({
        portal: portalPrefix.slice(1),
        portalPrefix,
        linkPrefix: isK12Portal ? portalPrefix : '',
        setPortal: jest.fn(),
        hrefInPortal: jest.fn(),
        rewriteLinks: jest.fn(),
        isK12Portal,
        setIsK12Portal: jest.fn()
    });
}

function Link() {
    return <a href={useRexPortalLinkOrNot(rexLink)}>View online</a>;
}

describe('useRexPortalLinkOrNot', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('sends readers in a K12 portal to the book in that portal', () => {
        mockPortal('/school-portal', true);
        render(<Link />);

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            'https://openstax.org/apps/rex/portal/school-portal/books/algebra-1/pages/quick-start'
        );
    });

    it.each([
        ['another portal', '/landing-page', false],
        ['no portal', '', false]
    ])('leaves the link alone in %s', (_, portalPrefix, isK12Portal) => {
        mockPortal(portalPrefix, isK12Portal);
        render(<Link />);

        expect(screen.getByRole('link')).toHaveAttribute('href', rexLink);
    });
});
