import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import useAdoptionMicrosurveyContent from '~/layouts/default/microsurvey-popup/adoption-content';
import * as UM from '~/models/usermodel';
import userModelData from '~/../../test/src/data/userModel';
import { UserContextProvider } from '~/contexts/user';

/* eslint-disable camelcase */
function userModelAdopter(isAdopter: boolean) {
    const adopterFields = {
        using_openstax: isAdopter,
        faculty_status: isAdopter ? 'confirmed_faculty' : 'no_faculty_info'
    };

    return {...userModelData, accountsModel: {...userModelData.accountsModel, ...adopterFields}};
}
/* eslint-enable camelcase */

describe('microsurvey-popup/adoption-content', () => {
    const user = userEvent.setup();
    const saveError = console.error;

    function Component() {
        const [ready, AdoptionContent] = useAdoptionMicrosurveyContent();

        return ready
            ? <AdoptionContent><div>the page</div></AdoptionContent>
            : null;
    }

    function WrappedComponent({path}: {path: string}) {
        return <UserContextProvider>
            <MemoryRouter initialEntries={[path]}>
                <Component />
            </MemoryRouter>
        </UserContextProvider>;
    }
    it('renders nothing if user is not an adopter', async () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue({...userModelAdopter(false)});
        render(<WrappedComponent path='/' />);
        expect(document.body.textContent).toBe('');
    });
    it('renders nothing on the renewal-form even if user is an adopter', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue({...userModelAdopter(true)});
        render(<WrappedComponent path='/renewal-form' />);
        expect(document.body.textContent).toBe('');
    });
    it('renders the page on other paths if user is faculty/adopter', async () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue({...userModelAdopter(true)});
        render(<WrappedComponent path='/' />);
        screen.getByText('the page');
        const link = screen.getByRole('link');

        console.error = jest.fn();
        await user.click(link);
        expect(console.error).toHaveBeenCalled(); // because navigation
        console.error = saveError;
    });
});
