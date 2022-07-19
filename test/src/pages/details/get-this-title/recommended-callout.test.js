import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/preact';
import {DetailsContextProvider} from '~/pages/details/context';
import {LanguageContextProvider} from '~/contexts/language';
import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';

function LangWrapRecommendedCallout({...args}) {
    return (
        <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
            <LanguageContextProvider>
                <DetailsContextProvider>
                    <RecommendedCallout {...args} />
                </DetailsContextProvider>
            </LanguageContextProvider>
        </MemoryRouter>
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
