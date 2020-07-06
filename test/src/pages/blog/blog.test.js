import {BlogPage, DefaultPage, SearchResultsPage, ArticlePage} from '~/pages/blog/blog';
import {fetchPageData} from '~/helpers/controller/cms-mixin';
import {makeMountRender, snapshotify} from '../../../helpers/jsx-test-utils.jsx';

const slug = 'news';
const pageDataPromise = fetchPageData({slug});

describe('blog Default page', () => {
    it('matches snapshot', () => {
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

        return pageDataPromise.then((response) => {
            const wrapper = makeMountRender(DefaultPage, {
                articles: response.articles
            })();

            expect(snapshotify(wrapper)).toMatchSnapshot();
        });
    });
});

describe('blog Search Results page', () => {
    window.location = {
        "href":"https://cms-dev.openstax.org/blog/?jimmieka",
        "ancestorOrigins":{},
        "origin":"https://cms-dev.openstax.org",
        "protocol":"https:",
        "host":"cms-dev.openstax.org",
        "hostname":"cms-dev.openstax.org",
        "port":"",
        "pathname":"/blog/",
        "search":"?jimmieka",
        "hash":""
    };

    it('matches snapshot', () => {
        const wrapper = makeMountRender(SearchResultsPage, {
            location: window.location,
            setPath(newPath) {
                console.log('setPath called with', newPath);
            }
        })();

        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
});

describe('blog Article page', () => {
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

    it('matches snapshot', () => {
        return pageDataPromise.then((response) => {
            const wrapper = makeMountRender(ArticlePage, {
                location: window.location,
                setPath(newPath) {
                    console.log('setPath called with', newPath);
                },
                articles: response.articles
            })();

            expect(snapshotify(wrapper)).toMatchSnapshot();
        });
    });
});
