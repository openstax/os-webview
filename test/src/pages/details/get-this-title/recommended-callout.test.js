import React from 'react';
import {render, screen} from '@testing-library/preact';
import {LanguageContextProvider} from '~/contexts/language';
import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';
import BookDetailsLoader from '../book-details-context';

function LangWrapRecommendedCallout({...args}) {
    return (
        <LanguageContextProvider>
            <BookDetailsLoader slug={'books/college-algebra'}>
                <RecommendedCallout {...args} />
            </BookDetailsLoader>
        </LanguageContextProvider>
    );
}

test('defaults to "Recommended" and no blurb', async () => {
    render(<LangWrapRecommendedCallout />);
    await screen.findByText('Recommended');
    expect(screen.getByRole('button').nextSibling).toBeNull();
});
test('displays custom title', async () => {
    render(<LangWrapRecommendedCallout title="custom title" />)
    await screen.findByText('custom title');
});
test('displays custom blurb', async () => {
    const blurbHtml = '<b>some text</b>';

    render(<LangWrapRecommendedCallout blurb={blurbHtml} />)
    await screen.findByText('some text');
    expect(screen.getByRole('button').nextSibling).not.toBeNull();
})
