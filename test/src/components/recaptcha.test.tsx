import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import useRecaptchaToken from '~/components/recaptcha';

const mockReady = jest.fn().mockImplementation((fn: () => void) => fn());
const mockExecute = jest.fn().mockResolvedValue('token-got');

// @ts-expect-error not all properties defined
window.grecaptcha = {
    ready: mockReady,
    execute: mockExecute
};

function Component() {
    const {token, Recaptcha} = useRecaptchaToken();

    return <Recaptcha><h1>Token</h1><div>{token}</div></Recaptcha>;
}

describe('recaptcha', () => {
    it('hides children until there is a token', () => {
        render(<Component />);
        expect(screen.getByRole('button', {name: 'I am a human'})).toBeTruthy();
        expect(screen.queryByRole('heading')).toBeNull();
    });
    it('fetches a token when the "I am a human" button is clicked', async () => {
        const user = userEvent.setup();

        render(<Component />);
        await user.click(screen.getByRole('button', {name: 'I am a human'}));
        expect(mockExecute).toHaveBeenCalled();
        expect(screen.getByRole('heading')).toBeTruthy();
    });
    it('unsets the token after 100 seconds', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

        jest.useFakeTimers();
        render(<Component />);
        await user.click(screen.getByRole('button', {name: 'I am a human'}));
        expect(screen.getByRole('heading')).toBeTruthy();
        jest.runAllTimers();
        expect(await screen.findByRole('button')).toBeTruthy();
    });
});
