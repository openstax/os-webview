import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/preact';
import BodyUnit, {UnitType} from '~/components/body-units/body-units';

const mockDocument = jest.fn();

jest.mock('react-pdf/dist/esm/entry.webpack5', () => ({
    Document: () => mockDocument(),
    Page: jest.fn()
}));
jest.mock('react-pdf/dist/esm/Page/TextLayer.css', () => null);

describe('body-units', () => {
    it('warns on unknown', () => {
        const saveWarn = console.warn;
        const whoopsUnit = {
            type: 'whoops',
            value: 'terrible mistake'
        } as unknown as UnitType;

        console.warn = jest.fn();

        render(<BodyUnit unit={whoopsUnit} />);
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
        screen.getByText('terrible mistake', {exact: false});
    });
    it('handles CTA', () => {
        /* eslint-disable camelcase */
        const unit: UnitType = {
            id: 'meh',
            type: 'blog_cta',
            value: {
                alignment: 'left',
                heading: 'Heading',
                description: 'description text',
                button_href: '#',
                button_text: 'click me'
            }
        };

        render(<BodyUnit unit={unit} />);
        screen.getByRole('link', {name: 'click me'});
    });
    it('handles pull-quote', () => {
        const unit: UnitType = {
            id: 'pq',
            type: 'pullquote',
            value: {
                quote: 'what it says',
                attribution: 'who said it'
            }
        };

        render(<BodyUnit unit={unit} />);
        screen.getByText('what it says', {exact: true});
    });
    it('handles document (pdf)', async () => {
        const unit: UnitType = {
            id: 'pdf',
            type: 'document',
            value: {
                download_url: 'something'
            }
        };

        render(<BodyUnit unit={unit} />);
        await waitFor(() => expect(mockDocument).toHaveBeenCalled());
    });
});
