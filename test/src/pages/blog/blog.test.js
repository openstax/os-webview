import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {BlogPage, DefaultPage, ArticlePage} from '~/pages/blog/blog';
import {fetchPageData} from '~/helpers/controller/cms-mixin';

const slug = 'news';
const pageDataPromise = fetchPageData({slug});

test('blog default page', () => {
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

    return pageDataPromise.then(({articles}) => {
        render(<DefaultPage articles={articles} />);
        expect(screen.queryAllByText('read more')).toHaveLength(93);
    });
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
    const setPath = (newPath) => {
        console.log('setPath called with', newPath);
    };

    return pageDataPromise.then(({articles}) => {
        render(<ArticlePage location={window.location} {...{setPath, articles}}/>);
        expect(screen.queryAllByText('read more')).toHaveLength(93);
    });
});
