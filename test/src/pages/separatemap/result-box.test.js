import ResultBox from '~/pages/separatemap/search-box/result-box/result-box';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import React from 'react';

function Wrapper({model, onChange}) {
    const [theOpenOne, setTheOpenOne] = React.useState();

    React.useLayoutEffect(() => {
        onChange(theOpenOne);
    }, [theOpenOne]);

    return (
        <ResultBox {...{theOpenOne, setTheOpenOne, model}} />
    );
}

describe('ResultBox', () => {
    let theOpenOne = null;
    const wrapper = makeMountRender(Wrapper, {
        model: {
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
        },
        onChange(value) {
            theOpenOne = value;
        }
    })();

    it('opens on click of toggle', () => {
        expect(wrapper.find('.school-details')).toHaveLength(0);
        expect(theOpenOne).toBeFalsy();
        wrapper.find('.toggle-details').simulate('click');
        expect(theOpenOne).toBeTruthy();
    });
});
