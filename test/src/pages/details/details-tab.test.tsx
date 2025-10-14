// details-tab is dynamically loaded, so needs to be tested separately
import React from 'react';
import {render, screen} from '@testing-library/preact';
import DetailsTab from '~/pages/details/desktop-view/details-tab/details-tab';
import {LanguageContextProvider} from '~/contexts/language';

type Props = Parameters<typeof DetailsTab>[0];

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
            <DetailsTab {...props} />
        </LanguageContextProvider>
    );
}

describe('details-tab', () => {
    it('renders (English)', () => {
        render(<Component model={model} polish={false} />);
        screen.getByRole('heading', {level: 3, name: 'Summary'});
    });
    it('renders (Polish)', () => {
        render(<Component model={model} polish={true} />);
        screen.getByRole('heading', {level: 3, name: 'Przejdź do książki'});
    });
});
