import InstructorResourcesPane from '~/pages/details/phone-view/instructor-resources-pane/instructor-resources-pane.js';
import details from '../../data/details.js'
import instanceReady from '../../../helpers/instance-ready';
import shellBus from '~/components/shell/shell-bus';
import {clickElement} from '../../../test-utils';
const instructorResources = {
    freeResources: details.book_faculty_resources,
    paidResources: details.book_allies
};
const instructor = {
    isStudent: false,
    isInstructor: true,
    userInfo: {
        id: 2
    }
};

describe('InstructorResourcesPane (as instructor)', () => {
    const {instance: pane, ready} = instanceReady(InstructorResourcesPane, {
        compCopyDialogProps: {},
        resources: instructorResources,
        userStatusPromise: Promise.resolve(instructor)
    });

    it('creates a resource box for each free resource', () =>
        ready.then(() => {
            const freeResourceBoxes = Array.from(
                pane.el.querySelectorAll('.free-resources-region > .resource-box')
            );

            expect(freeResourceBoxes.length).toBe(instructorResources.freeResources.length);
        })
    );
    it('handles comp copy click', () =>
        ready.then(() => {
            const compCopyEl = pane.el.querySelector('a[href$="/comp-copy"]');
            let received = null;

            expect(compCopyEl).toBeTruthy();
            shellBus.on('showDialog', (payload) => {
                received = payload;
            });
            clickElement(compCopyEl);
            expect(received).toBeTruthy();
        })
    );
});
