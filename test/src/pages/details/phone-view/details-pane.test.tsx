// details-tab is dynamically loaded, so needs to be tested separately
import React from 'react';
import {render, screen} from '@testing-library/preact';
import DetailsPane from '~/pages/details/phone-view/details-pane/details-pane';
import {LanguageContextProvider} from '~/contexts/language';

type Props = Parameters<typeof DetailsPane>[0];

jest.mock('~/pages/details/common/get-this-title');

const model = {
    id: 2,
    title: 'model-title',
    description: 'model-description',
    adoptions: 69,
    slug: 'whatever'
} as Props['model'];

function Component(props: Props) {
    return (
        <LanguageContextProvider>
            <DetailsPane {...props} />
        </LanguageContextProvider>
    );
}

describe('phone-view/details-pane', () => {
    it('renders (English)', () => {
        render(<Component model={model} polish={false} />);
        const details = screen.getAllByRole('group');

        expect(details).toHaveLength(2);
        expect(details[0].textContent).toBe('Authors');
    });
    it('renders (Polish)', () => {
        render(<Component model={model} polish={true} />);
        const details = screen.getAllByRole('group');

        expect(details).toHaveLength(2);
        expect(details[0].textContent).toBe('Autorzy');
    });
});
