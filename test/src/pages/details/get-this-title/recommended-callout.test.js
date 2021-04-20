import React from 'react';
import {render, screen} from '@testing-library/preact';
import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';

test('defaults to "Recommended" and no blurb', () => {
    render(<RecommendedCallout />);
    expect(screen.getByText('Recommended')).toBeTruthy();
    expect(screen.getByRole('button').nextSibling).toBeNull();
});
test('displays custom title', () => {
    render(<RecommendedCallout title="custom title" />)
    expect(screen.getByText('custom title')).toBeTruthy();
});
test('displays custom blurb', () => {
    const blurbHtml = '<b>some text</b>';

    render(<RecommendedCallout blurb={blurbHtml} />)
    expect(screen.getByRole('button').nextSibling).not.toBeNull();
    expect(screen.getByText('some text')).toBeTruthy();
})
