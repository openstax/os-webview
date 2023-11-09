import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import BookDetailsLoader from '../book-details-context';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData, camelCaseKeys} from '~/helpers/page-data-utils';

const model = camelCaseKeys(transformData(details));

function GTTinContext() {
    return (
        <BookDetailsLoader slug={'books/college-algebra'}>
            <TOCContextProvider>
                <GetThisTitle model={model} />
            </TOCContextProvider>
        </BookDetailsLoader>
    );
}

async function expectOptions(value) {
    const options = await screen.findAllByRole('link');
    const expandLink = options[options.length - 1];
    const user = userEvent.setup();

    expect(options).toHaveLength(value);
    await user.click(expandLink);
}

// ** There aren't enough options to have them get hidden since Print is separated out
// test('handles hiding and expanding non-preferred formats', async () => {
//     render(<GTTinContext />);

//     await screen.findByText('View online');
//     let options = screen.queryAllByRole('link');
//     let toggleLink = options.pop();

//     expect(options).toHaveLength(4);
//     const user = userEvent.setup();

//     await user.click(toggleLink);
//     await screen.findByText('See 1 fewer option');
//     options = screen.queryAllByRole('link');
//     toggleLink = options.pop();
//     expect(options).toHaveLength(4);

//     await user.click(toggleLink);
//     await screen.findByText('+ 1 more option...');
//     options = screen.queryAllByRole('link');
//     toggleLink = options.pop();
//     expect(options).toHaveLength(3);
// });

test('does the callout for Rex book', async () => {
    render(<GTTinContext />);

    await screen.queryAllByText('Recommended');
});
