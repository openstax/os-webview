import {InstructorResourcePane} from '~/pages/details/phone-view/instructor-resources-pane/instructor-resources-pane.jsx';
import details from '../../data/details.js'
import {makeMountRender, snapshotify} from '../../../helpers/jsx-test-utils.jsx';

const instructorResources = details.book_faculty_resources;
const instructor = {
    isStudent: false,
    isInstructor: true,
    userInfo: {
        id: 2
    }
};

describe('InstructorResourcePane (as instructor)', () => {
    it('matches snapshot', () => {
        const wrapper = makeMountRender(InstructorResourcePane, {
            bookId: 42,
            compCopyDialogProps: {},
            featuredResources: [],
            videoResources: [],
            blogLinkResources: [],
            referenceResources: [],
            otherResources: instructorResources,
            userStatusPromise: Promise.resolve(instructor)
        })();

        expect(snapshotify(wrapper)).toMatchSnapshot();
    });
});
