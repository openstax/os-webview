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

test('defaults to "Recommended" and no blurb', (done) => {
    render(<LangWrapRecommendedCallout />);
    setTimeout(() => {
        expect(screen.getByText('Recommended')).toBeTruthy();
        expect(screen.getByRole('button').nextSibling).toBeNull();
        done();
    }, 40);
});
test('displays custom title', (done) => {
    render(<LangWrapRecommendedCallout title="custom title" />)
    setTimeout(() => {
        expect(screen.getByText('custom title')).toBeTruthy();
        done();
    }, 40);
});
test('displays custom blurb', () => {
    const blurbHtml = '<b>some text</b>';

    render(<LangWrapRecommendedCallout blurb={blurbHtml} />)
    setTimeout(() => {
        expect(screen.getByRole('button').nextSibling).not.toBeNull();
        expect(screen.getByText('some text')).toBeTruthy();
        done();
    }, 40);
})
