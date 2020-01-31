import InstructorResourceTab from '~/pages/details/instructor-resource-tab/instructor-resource-tab';
import details from '../../data/details-biology-2e.js';
import instanceReady from '../../../helpers/instance-ready';
import shellBus from '~/components/shell/shell-bus';
import {clickElement} from '../../../test-utils';
import {transformData} from '~/helpers/controller/cms-mixin';

const instructor = {
    isStudent: false,
    isInstructor: true,
    userInfo: {
        id: 2
    }
};
const pageData = transformData(details);

const {instance: pane, ready} = instanceReady(InstructorResourceTab,
    {
        bookAbbreviation: 'BIOLOGY',
        userStatusPromise: Promise.resolve(instructor),
        model: {
            resources: pageData.book_faculty_resources,
            allies: pageData.book_allies,
            freeStuff: {
                heading: pageData.free_stuff_instructor.content.heading,
                blurb: pageData.free_stuff_instructor.content.content,
                loggedInBlurb: pageData.free_stuff_instructor.content.content_logged_in
            },
            webinar: {
                text: pageData.webinar_content.content.heading,
                url: pageData.webinar_content.link,
                blurb: pageData.webinar_content.content.content
            },
            communityResource: {
                heading: pageData.community_resource_heading,
                logoUrl: pageData.community_resource_logo_url,
                url: pageData.community_resource_url,
                cta: pageData.community_resource_cta,
                blurb: pageData.community_resource_blurb,
                featureUrl: pageData.community_resource_feature_link_url,
                featureText: pageData.community_resource_feature_text
            }
        },
        dialogProps: {}
    }
);


describe('Instructor Resources Tab', () => {
    it('creates', () =>
        ready.then(() => {
            expect(pane).toBeTruthy();
        })
    );
});
