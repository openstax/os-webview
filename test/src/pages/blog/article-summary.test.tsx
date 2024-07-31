import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import ArticleSummary, {blurbModel} from '~/pages/blog/article-summary/article-summary';
import userEvent from '@testing-library/user-event';

describe('article-summary', () => {
    it('handles openInNewWindow', async () => {
        const setPath = jest.fn();
        const user = userEvent.setup();

        render(
            <ArticleSummary
                articleSlug='article-slug'
                image='image-url'
                headline='Article Headline'
                subheading='Sub heading'
                body='some text'
                date='Today'
                author='Jest'
                collectionNames={['tag1', 'tag2']}
                articleSubjectNames={[]}
                setPath={setPath}
                openInNewWindow={true}
            />
        );
        const links = await screen.findAllByRole('link');

        expect(links).toHaveLength(2);
        expect(links.filter((l) => l.getAttribute('target') === '_blank')).toHaveLength(2);

        await user.click(links[0]);
        expect(setPath).not.toBeCalled();
    });
    it('sets path when not openInNewWindow', async () => {
        const setPath = jest.fn();
        const user = userEvent.setup();

        render(
            <ArticleSummary
                articleSlug='article-slug'
                image='image-url'
                headline='Article Headline'
                subheading='Sub heading'
                body='some text'
                date='Today'
                author='Jest'
                collectionNames={['tag1', 'tag2']}
                articleSubjectNames={[]}
                setPath={setPath}
                openInNewWindow={false}
            />
        );
        const links = await screen.findAllByRole('link');

        expect(links).toHaveLength(2);
        expect(links.filter((l) => l.getAttribute('target') === '_blank')).toHaveLength(0);

        await user.click(links[0]);
        expect(setPath).toBeCalled();
    });
});

describe('blurbModel', () => {
    it('returns empty object when no data', () => {
        expect(blurbModel(null)).toEqual({});
    });
    it('handles nested collection and articleSubject data', () => {
        const value = blurbModel({
            slug: 'required',
            collections: [
                {
                    value: [{
                        collection: {name: 'first collection', value: []}
                    }]
                }
            ],
            articleSubjects: [
                {
                    value: [{
                        subject: {name: 'first articleSubject', value: []}
                    }]
                }
            ]
        } as unknown as Parameters<typeof blurbModel>[0]);

        expect(value.collectionNames).toEqual(['first collection']);
        expect(value.articleSubjectNames).toEqual(['first articleSubject']);
    });
});
