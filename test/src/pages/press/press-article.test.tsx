import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as UPD from '~/helpers/use-page-data';
import ArticleLoader from '~/pages/press/article/article';

describe('press-article', () => {
    it('returns null if no data', () => {
        jest.spyOn(UPD, 'default').mockReturnValueOnce(undefined);
        render(<ArticleLoader slug="waiting" />);
        expect(document.body.textContent).toBe('');
    });
    it('returns not found if data has error', () => {
        jest.spyOn(UPD, 'default').mockReturnValueOnce({
            error: {message: 'whoops!'}
        });
        render(<ArticleLoader slug="not-there" />);
        screen.getByRole('heading', {level: 1, name: '[Article not found]'});
    });
    it('returns article based on data (no hero image)', () => {
        jest.spyOn(UPD, 'default').mockReturnValueOnce({
            articleImage: null,
            subheading: 'the-subhead',
            title: 'the-title',
            author: 'the author',
            date: '2017-09-27',
            body: [
                {
                    type: 'paragraph',
                    value: '<p>HOUSTON — (Sept. 27, 2017) — some article text</p>'
                }
            ]
        });
        render(<ArticleLoader slug="not-there" />);
        screen.getByRole('heading', {level: 1, name: 'the-title'});
        screen.getByRole('heading', {level: 2, name: 'the-subhead'});
        screen.getByText('Sep 27, 2017');
    });
    it('returns article based on data (with hero image)', () => {
        jest.spyOn(UPD, 'default').mockReturnValueOnce({
            articleImage: '/path/to/image',
            subheading: 'the-subhead',
            title: 'the-title',
            author: 'the author',
            date: '2017-09-27',
            body: [
                {
                    type: 'paragraph',
                    value: '<p>HOUSTON — (Sept. 27, 2017) — some article text</p>'
                }
            ]
        });
        render(<ArticleLoader slug="not-there" />);
        expect(screen.getByRole('presentation').className).toBe('strips');
    });
});
