import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import BookDetailsContext from '../book-details-context';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData} from '~/helpers/page-data-utils';
import $ from '~/helpers/$';

const model = $.camelCaseKeys(transformData(details));

function GTTinContext() {
    return (
        <BookDetailsContext>
            <TOCContextProvider>
                <GetThisTitle model={model} />
            </TOCContextProvider>
        </BookDetailsContext>
    );
}

test('handles Print Copy dialog', async () => {
    render(<GTTinContext />);
    await screen.findByText('Order a print copy');
});

async function expectOptions(value) {
    const options = await screen.findAllByRole('link');
    const expandLink = options[options.length - 1];
    const user = userEvent.setup();

    expect(options).toHaveLength(value);
    await user.click(expandLink);
}

test('handles hiding and expanding non-preferred formats', async () => {
    render(<GTTinContext />);

    await screen.findByText('Order a print copy');
    let options = screen.queryAllByRole('link');
    let toggleLink = options.pop();

    expect(options).toHaveLength(3);
    const user = userEvent.setup();

    await user.click(toggleLink);
    await screen.findByText('See 1 fewer option');
    options = screen.queryAllByRole('link');
    toggleLink = options.pop();
    expect(options).toHaveLength(4);

    await user.click(toggleLink);
    await screen.findByText('+ 1 more option...');
    options = screen.queryAllByRole('link');
    toggleLink = options.pop();
    expect(options).toHaveLength(3);
});

test('does the callout for Rex book', async () => {
    render(<GTTinContext />);

    await screen.queryAllByText('Recommended');
});
