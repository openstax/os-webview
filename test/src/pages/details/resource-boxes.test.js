import ResourceBoxes from '~/pages/details/common/resource-box/resource-boxes';
import {instructorResourceBoxPermissions, studentResourceBoxPermissions} from '~/pages/details/common/resource-box/resource-box';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

// Test all the conditions in here:
// userStatus: isInstructor: true|false
// userStatus: pending_verification: true|false
// resourceStatus: isExternal: true|false
// resourceData: link_text, link_external, link_document_url

describe('ResourceBoxes', () => {
    const resourceData = {
        resourceUnlocked: true,
        linkText: 'Click this',
        linkDocumentUrl: '/download'
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
        expect(wrapper.find('.bottom .left-button').text()).toBe(resourceData.linkText);
    });

    it('handles locked instructor resources', () => {
        const wrapper = instructorWrapper({
            resourceUnlocked: false
        });

        expect(wrapper.find('.bottom .left-button').text()).toBe('Login to unlock');
    });

    it('allows instructors access to locked resources', () => {
        const wrapper = instructorWrapper(
            {
                resourceUnlocked: false
            },
            {
                isInstructor: true
            }
        );

        expect(wrapper.find('.bottom .left-button').text()).toBe(resourceData.linkText);
    });

    it('handles locked student resources', () => {
        const wrapper = studentWrapper({
            resourceUnlocked: false
        },
        {
            isStudent: false,
            isInstructor: false
        });

        expect(wrapper.find('.bottom .left-button').text()).toBe('Login to unlock');
    });

    it('allows students access to locked resources', () => {
        const wrapper = studentWrapper({
        },
        {
            isStudent: true,
            isInstructor: false
        });

        expect(wrapper.find('.bottom .left-button').text()).toBe(resourceData.linkText);
    });

    it('allows instructors access to locked student resources', () => {
        const wrapper = studentWrapper({
        },
        {
            isStudent: false,
            isInstructor: true
        });

        expect(wrapper.find('.bottom .left-button').text()).toBe(resourceData.linkText);
        expect(wrapper.find('.bottom .right .fa-download')).toBeTruthy();
    });

    it('understands external links', () => {
        const wrapper = studentWrapper({
            linkDocumentUrl: null,
            linkExternal: 'http://example.com/external_link'
        },
        {
            isStudent: false,
            isInstructor: true
        });

        expect(wrapper.find('.bottom .left-button').text()).toBe(resourceData.linkText);
        expect(wrapper.find('.bottom .right .fa-external-link-alt')).toBeTruthy();
    });
});
