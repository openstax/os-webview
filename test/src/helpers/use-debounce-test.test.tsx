import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import useDebounceTest from '~/helpers/use-debounce-test';

function Component({testValue}: {testValue: boolean}) {
    const timedOut = useDebounceTest(testValue);

    return <>{timedOut.toString()}</>;
}

function Component2() {
    const [tv, setTv] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setTv(false), 10);
    }, []);

    return <Component testValue={tv} />;
}

describe('use-debounce-test', () => {
    it('true test starts out false, becomes true after timers run', async () => {
        jest.useFakeTimers();
        render(<Component testValue={true} />);
        expect((await screen.findByText('false')).textContent).toBe('false');
        jest.runAllTimers();
        expect((await screen.findByText('true')).textContent).toBe('true');
    });
    it('false test stays false after timers run', async () => {
        jest.useFakeTimers();
        render(<Component testValue={false} />);
        expect((await screen.findByText('false')).textContent).toBe('false');
        jest.runAllTimers();
        expect((await screen.findByText('false')).textContent).toBe('false');
    });
    it('returns false if test becomes false before timeout', async () => {
        // Nothing changes, but it exercises all code branches
        jest.useFakeTimers();
        render(<Component2 />);
        expect((await screen.findByText('false')).textContent).toBe('false');
        jest.advanceTimersByTime(10);
        expect((await screen.findByText('false')).textContent).toBe('false');
        jest.runAllTimers();
        expect((await screen.findByText('false')).textContent).toBe('false');
    });
});
