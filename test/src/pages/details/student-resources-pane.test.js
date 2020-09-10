import StudentResourcesPane from '~/pages/details/phone-view/student-resources-pane/student-resources-pane.js';
import details from '../../data/details.js'
import instanceReady from '../../../helpers/instance-ready';
import shellBus from '~/components/shell/shell-bus';
import {clickElement} from '../../../test-utils';

const student = {
    isStudent: true
};

const nonstudent = {
    isStudent: false
}

describe('StudentResourcesPane (as student)', () => {
    const {instance: pane, ready} = instanceReady(StudentResourcesPane, {
        compCopyDialogProps: {},
        resources: details.book_student_resources,
        userStatusPromise: Promise.resolve(student)
    });

    it('creates a resource box for each free resource', () =>
        ready.then(() => {
            const resourceBoxes = Array.from(
                pane.el.querySelectorAll('.student-resources-pane > .resource-box')
            );

            expect(resourceBoxes.length).toBe(details.book_student_resources.length);
        })
    );
    it('unlocks resources', () =>
        ready.then(() => {
            const box = pane.el.querySelector('.resource-box .bottom > .left-button');

            expect(box.textContent).toBe('Download');
        })
    );
});

describe('StudentResourcesPane (as nonstudent)', () => {
    const {instance: pane, ready} = instanceReady(StudentResourcesPane, {
        compCopyDialogProps: {},
        resources: details.book_student_resources,
        userStatusPromise: Promise.resolve(nonstudent)
    });

    it('creates a resource box for each free resource', () =>
        ready.then(() => {
            const resourceBoxes = Array.from(
                pane.el.querySelectorAll('.student-resources-pane > .resource-box')
            );

            expect(resourceBoxes.length).toBe(details.book_student_resources.length);
        })
    );
    it('does not unlock resources', () =>
        ready.then(() => {
            const box = pane.el.querySelector('.resource-box .bottom > .left-button');

            expect(box.textContent).toBe('Login to unlock');
        })
    );
});
