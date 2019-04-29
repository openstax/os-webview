import '../../helpers/fetch-mocker';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import instanceReady from '../../helpers/instance-ready';

describe('RoleSelector', () => {
    const {instance, ready} = instanceReady(RoleSelector, () => [
        {
            contents: new StudentForm(),
            hideWhen: (role) => role !== 'Student'
        }
    ]);

    it('loads with default selection', () =>
        ready.then(() => {
            expect(instance.selectedRole).toBe('Student');
        })
    );
});
