import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import {useSet} from '~/helpers/data';

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
    it('useSet add/delete', async () => {
        render(<Component />);
        await screen.findByText('ok', undefined, {timeout: 200});
    });
});
