import ResourceBoxes from '~/pages/details/resource-box/resource-boxes';
import {instructorResourceBoxPermissions, studentResourceBoxPermissions} from '~/pages/details/resource-box/resource-box';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

// Test all the conditions in here:
// userStatus: isInstructor: true|false
// userStatus: pending_verification: true|false
// resourceStatus: isExternal: true|false
// resourceData: link_text, link_external, link_document_url

describe('ResourceBoxes', () => {
    const resourceData = {
        resource_unlocked: true,
        link_text: 'Click this',
        link_document_url: '/download'
    };
    const userStatus = {
        isInstructor: false
    };
    const payload = {
        heading: 'This is the heading',
        description: 'This is <b>a description</b> in HTML',
    }

    function instructorWrapper(resDelta, userDelta={}) {
        const res = Object.assign({}, resourceData, resDelta);
        const user = Object.assign({}, userStatus, userDelta)

        return makeMountRender(ResourceBoxes, {
            models: [
                Object.assign(payload, instructorResourceBoxPermissions(
                    res, user, 'Instructor resources'
                ))
            ]
        })();
    }

    function studentWrapper(resDelta, userDelta={}) {
        const res = Object.assign({}, resourceData, resDelta);
        const user = Object.assign({}, userStatus, userDelta)

        return makeMountRender(ResourceBoxes, {
            models: [
                Object.assign(payload, studentResourceBoxPermissions(
                    res, user, 'Student resource'
                ))
            ]
        })();
    }

    it('handles unlocked instructor resources', () => {
        const wrapper = instructorWrapper({});

        expect(wrapper.find('.top h3').text()).toBe(payload.heading);
        expect(wrapper.find('.top-line + .description').html()).toContain(payload.description);
        expect(wrapper.find('.bottom .download-button').text()).toBe(resourceData.link_text);
    });

    it('handles locked instructor resources', () => {
        const wrapper = instructorWrapper({
            resource_unlocked: false
        });

        expect(wrapper.find('.bottom .download-button').text()).toBe('Log in to unlock');
    });

    it('allows instructors access to locked resources', () => {
        const wrapper = instructorWrapper(
            {
                resource_unlocked: false
            },
            {
                isInstructor: true
            }
        );

        expect(wrapper.find('.bottom .download-button').text()).toBe(resourceData.link_text);
    });

    it('handles locked student resources', () => {
        const wrapper = studentWrapper({
            resource_unlocked: false
        },
        {
            isStudent: false,
            isInstructor: false
        });

        expect(wrapper.find('.bottom .download-button').text()).toBe('Log in to unlock');
    });

    it('allows students access to locked resources', () => {
        const wrapper = studentWrapper({
        },
        {
            isStudent: true,
            isInstructor: false
        });

        expect(wrapper.find('.bottom .download-button').text()).toBe(resourceData.link_text);
    });

    it('allows instructors access to locked student resources', () => {
        const wrapper = studentWrapper({
        },
        {
            isStudent: false,
            isInstructor: true
        });

        expect(wrapper.find('.bottom .download-button').text()).toBe(resourceData.link_text);
        expect(wrapper.find('.bottom .right .fa-download')).toBeTruthy();
    });

    it('understands external links', () => {
        const wrapper = studentWrapper({
            link_document_url: null,
            link_external: 'http://example.com/external_link'
        },
        {
            isStudent: false,
            isInstructor: true
        });

        expect(wrapper.find('.bottom .download-button').text()).toBe(resourceData.link_text);
        expect(wrapper.find('.bottom .right .fa-external-link-alt')).toBeTruthy();
    });
});
