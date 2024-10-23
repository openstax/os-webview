import React from 'react';
import {describe, test, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {useSet, assertDefined} from '~/helpers/data';

function Component() {
    const s = useSet([1]);
    const valueArray = React.useMemo(() => Array.from(s.values()), [s]);

    React.useEffect(() => {
        if (!s.has(2)) {
            s.add(2);
            s.delete(1);
        }
    }, [s]);

    if (JSON.stringify(valueArray) === JSON.stringify([2])) {
        return <div>ok</div>;
    }
    return (
        <div>
            {JSON.stringify(s.values)} is not {JSON.stringify([2])}
        </div>
    );
}

describe('helpers/data', () => {
    test('useSet add/delete', async () => {
        render(<Component />);
        await screen.findByText('ok', undefined, {timeout: 200});
    });
    test('assertDefined throws', () => {
        const foo: string | undefined = undefined;

        expect(() => assertDefined(foo)).toThrowError();
    });
});
