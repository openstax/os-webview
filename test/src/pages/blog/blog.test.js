import React from 'react';
import {render, screen} from '@testing-library/preact';
import {BlogContextProvider} from '~/pages/blog/blog-context';
import {BlogPage, DefaultPage, ArticlePage} from '~/pages/blog/blog';

test('blog default page', (done) => {
    window.location = {
        "href":"https://cms-dev.openstax.org/blog",
        "ancestorOrigins":{},
        "origin":"https://cms-dev.openstax.org",
        "protocol":"https:",
        "host":"cms-dev.openstax.org",
        "hostname":"cms-dev.openstax.org",
        "port":"",
        "pathname":"/blog",
        "search":"",
        "hash":""
    };

    render(
        <BlogContextProvider>
            <DefaultPage />
        </BlogContextProvider>
    );
    setTimeout(() => {
        expect(screen.queryAllByText('read more')).toHaveLength(13);
        expect(screen.queryAllByRole('textbox')).toHaveLength(1);
        done();
    }, 10);
});

test('blog Article page', () => {
    window.location = {
        "href":"https://cms-dev.openstax.org/blog/jimmieka-mills-part-4-experience-best-teacher",
        "ancestorOrigins":{},
        "origin":"https://cms-dev.openstax.org",
        "protocol":"https:",
        "host":"cms-dev.openstax.org",
        "hostname":"cms-dev.openstax.org",
        "port":"",
        "pathname":"/blog/jimmieka-mills-part-4-experience-best-teacher",
        "search":"",
        "hash":""
    };

    render(
        <BlogContextProvider>
            <ArticlePage slug="blog-article" />
        </BlogContextProvider>
    );
    setTimeout(() => {
        expect(screen.queryAllByText('read more')).toHaveLength(12);
        expect(screen.queryAllByRole('textbox')).toHaveLength(1);
        done();
    }, 10);
});
