import loginMenuPromise from '~/components/shell/header/main-menu/login-menu/login-menu';
import userModelBus from '~/models/usermodel-bus';

describe('login-menu', () => {
    const el = document.createElement('div');

    it('creates with Login when no user logged in', () => {
        userModelBus.serve(
            'userModel-load',
            () => Promise.resolve({})
        );
        return loginMenuPromise(el).then((instance) => {
            expect(instance).toBeTruthy();
            expect(instance.el.textContent).toBe('Login');
        });
    });

    it('creates with dropdown when Tutor user is logged in', () => {
        userModelBus.serve(
            'userModel-load',
            () => Promise.resolve({
                id: 1,
                groups: ['OpenStax Tutor'],
                first_name: 'Human'
            })
        );
        return loginMenuPromise(el).then((instance) => {
            expect(instance).toBeTruthy();
            expect(instance.el.textContent).toMatch('Hi Human');
            expect(instance.el.textContent).toMatch('OpenStax Tutor');
        });
    });
    it('creates with dropdown when non-Tutor user is logged in', () => {
        userModelBus.serve(
            'userModel-load',
            () => Promise.resolve({
                id: 1,
                groups: [],
                first_name: 'Human'
            })
        );
        userModelBus.serve(
            'accountsModel-load',
            () => {
                console.log('Setting Tutor');

                return Promise.resolve({
                    applications: ['OpenStax Tutor']
                });
            }
        );
        return loginMenuPromise(el).then((instance) => {
            expect(instance).toBeTruthy();
            expect(instance.el.textContent).toMatch('Hi Human');
            expect(instance.el.textContent).not.toMatch('OpenStax Tutor');
        });
    });
});
