import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import TabGroup from '~/components/tab-group/tab-group';

describe('tab-group', () => {
    it('renders', async () => {
        const setSelectedLabel = jest.fn();
        const user = userEvent.setup();

        render(<TabGroup
            labels={['one', 'two']}
            selectedLabel='one'
            setSelectedLabel={setSelectedLabel}
            data-analytics-nav='dan'
        >
            <div>one</div>
            <div>two</div>
        </TabGroup>);

        const tabs = await screen.findAllByRole('tab');

        expect(tabs).toHaveLength(2);
        await(user.click(tabs[1]));
        expect(setSelectedLabel).toHaveBeenCalledWith('two');
    });
});
