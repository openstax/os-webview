import ResourceBox from '~/pages/details/resource-box/resource-box';

// Test all the conditions in here:
// userStatus: isInstructor: true|false
// userStatus: pending_verification: true|false
// resourceStatus: isExternal: true|false
// resourceData: link_text, link_external, link_document_url

describe('ResourceBox', () => {
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

    it('handles unlocked instructor resources', () => {
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.top h3').textContent).toBe(payload.heading);
        expect(el.querySelector('[data-html="description"]').innerHTML).toBe(payload.description);
        expect(el.querySelector('.bottom .left').textContent).toBe(resourceData.link_text);
        expect(el.querySelector('.bottom .right .fa-download')).toBeTruthy();
    });

    it('handles locked instructor resources', () => {
        resourceData.resource_unlocked = false;
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe('Login to unlock');
        expect(el.querySelector('.bottom .right .fa-lock')).toBeTruthy();
    });

    it('allows instructors access to locked resources', () => {
        userStatus.isInstructor = true;
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.instructorResourceBoxPermissions(resourceData, userStatus, 'Instructor resources'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe(resourceData.link_text);
        expect(el.querySelector('.bottom .right .fa-download')).toBeTruthy();

    });

    it('handles locked student resources', () => {
        userStatus.isStudent = false;
        userStatus.isInstructor = false;
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus, 'Student resource'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe('Login to unlock');
        expect(el.querySelector('.bottom .right .fa-lock')).toBeTruthy();
    });

    it('allows students access to locked resources', () => {
        userStatus.isStudent = true;
        userStatus.isInstructor = false;
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus, 'Student resource'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe(resourceData.link_text);
        expect(el.querySelector('.bottom .right .fa-download')).toBeTruthy();

    });
    it('allows instructors access to locked student resources', () => {
        userStatus.isStudent = false;
        userStatus.isInstructor = true;
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus, 'Student resource'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe(resourceData.link_text);
        expect(el.querySelector('.bottom .right .fa-download')).toBeTruthy();

    });

    it('understands external links', () => {
        delete resourceData.link_document_url;
        resourceData.link_external = 'http://example.com/external_link';
        const resourceBox = new ResourceBox(
            Object.assign(payload, ResourceBox.studentResourceBoxPermissions(resourceData, userStatus, 'Student resource'))
        );
        const el = resourceBox.el;

        expect(el.querySelector('.bottom .left').textContent).toBe(resourceData.link_text);
        expect(el.querySelector('.bottom .right .fa-external-link-alt')).toBeTruthy();

    });
});
