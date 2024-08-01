import React from 'react';
import {render} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import Promo from '~/pages/details/desktop-view/promo';

describe('details/promo', () => {
    it('returns null when no snippet content', () => {
        const snippet = [{}];

        render(
            <Promo promoteSnippet={snippet} />
        );
        expect(document.body.textContent).toBe('');
    });
    it('returns the description from the snippet', () => {
        const snippet = {
            content: {
                description: 'snippet description'
            }
        };

        render(
            <Promo promoteSnippet={snippet} />
        );
        expect(document.body.textContent).toBe('snippet description');
    });
});
