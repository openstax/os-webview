import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ResultBox from '~/pages/separatemap/search-box/result-box/result-box';

const model = {
    cityState: "Pomfret, Maryland",
    fields: {
        salesforce_id: "0016f00002alpsuAAA",
        name: "Maurice J. McDonough High School",
        phone: "(301) 934-2944",
        website: "https://www.ccboe.com/schools/mcdonough/",
        type: "High School"
    },
    institutionType: "High School",
    institutionalPartner: false,
    lngLat: (2) [-77.034, 38.555],
    pk: 656595,
    testimonial: {
        text: 'Good stuff',
        name: 'Some Body',
        position: 'Chief Example'
    }
};
function Wrapper() {
    const [theOpenOne, setTheOpenOne] = React.useState();

    return (
        <ResultBox {...{theOpenOne, setTheOpenOne, model}} />
    );
}

it('opens on click of toggle', () => {
    render(<Wrapper />);
    expect(screen.queryAllByText('savings', {exact: false})).toHaveLength(0);
    userEvent.click(screen.getByRole('switch'));
    expect(screen.queryAllByText('savings', {exact: false})).toHaveLength(1);
});
