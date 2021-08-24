import React from 'react';
import {render, screen} from '@testing-library/preact';
import {LanguageContextProvider} from '~/contexts/language';
import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';

function LangWrapRecommendedCallout({...args}) {
    return (
        <LanguageContextProvider>
            <RecommendedCallout {...args} />
        </LanguageContextProvider>
    );
}

test('defaults to "Recommended" and no blurb', () => {
    render(<LangWrapRecommendedCallout />);
    expect(screen.getByText('Recommended')).toBeTruthy();
    expect(screen.getByRole('button').nextSibling).toBeNull();
});
test('displays custom title', () => {
    render(<LangWrapRecommendedCallout title="custom title" />)
    expect(screen.getByText('custom title')).toBeTruthy();
});
test('displays custom blurb', () => {
    const blurbHtml = '<b>some text</b>';

    render(<LangWrapRecommendedCallout blurb={blurbHtml} />)
    expect(screen.getByRole('button').nextSibling).not.toBeNull();
    expect(screen.getByText('some text')).toBeTruthy();
})
