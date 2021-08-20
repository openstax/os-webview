import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GetThisTitle from '~/pages/details/common/get-this-title';
import {TOCContextProvider} from '~/pages/details/common/toc-slideout/context';
import {DetailsContextProvider} from '~/pages/details/context';
// College algebra book details
import details from '../../../data/details-college-algebra';
import {transformData} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';

const model = $.camelCaseKeys(transformData(details));

delete window.location;
window.location = {
    pathname: '/details/books/college-algebra'
};

function GTTinContext() {
    return (
        <DetailsContextProvider>
            <TOCContextProvider>
                <GetThisTitle model={model} />
            </TOCContextProvider>
        </DetailsContextProvider>
    );
}

test('handles Print Copy dialog', (done) => {
    render(<GTTinContext />);
    setTimeout(() => {
        const options = screen.getAllByRole('link');
        const printOption = options.filter((opt) => opt.textContent === 'Order a print copy');

        expect(options).toHaveLength(3);
        expect(printOption).toHaveLength(0);
        done();
    }, 0);
});
// TODO The rest of this :(
// test('handles hiding and expanding non-preferred formats', (done) => {
//     render(<GetThisTitle model={model} tocState={false} />);
//     setTimeout(() => {
//         const options = screen.getAllByRole('link');
//         const expandLink = options[options.length - 1];
//
//         expect(options).toHaveLength(4);
//         userEvent.click(expandLink);
//         expect(options).toHaveLength(5);
//         userEvent.click(expandLink);
//         expect(options).toHaveLength(4);
//         done();
//     }, 0);
// });
// test('respects enable_study_edge flag', () => {
//     const modelWithStudyEdge = Object.assign({}, model, {enableStudyEdge: true});
//     const seWrapper = makeMountRender(GetThisTitle, {
//         model: modelWithStudyEdge,
//         tocState: false
//     })();
//     const findStudyEdgeOption = (w) =>
//         w.find('.option').filterWhere((opt) => opt.text() === 'Download the app');
//
//     expect(findStudyEdgeOption(wrapper)).toHaveLength(0);
//     expect(findStudyEdgeOption(seWrapper)).toHaveLength(1);
// });
// test('does the callout for Rex book', () => {
//     const callout = wrapper.find('.callout');
//
//     expect(callout).toHaveLength(1);
//     expect(callout.text()).toMatch('Recommended');
// });
