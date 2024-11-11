import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

function Component({title}: {title?: string}) {
    return (
        <ShellContextProvider>
            <LetUsKnow title={title} />
        </ShellContextProvider>
    );
}

describe('details/let-us-know', () => {
    test('handles English title', () => {
        render(<Component title={englishTitle} />);

        screen.getByText('Using this book?', {exact: false});
    });
    test('handles Polish title', () => {
        render(<Component title={polishTitle} />);
        screen.getByText('Korzystasz z tej książki? Daj nam znać.');
    });
    test('handles empty title', () => {
        const {container} = render(<Component />);

        expect(container.textContent).toBe('');
    });
});
