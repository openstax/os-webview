import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';
import MultiPageForm from '~/components/multi-page-form/multi-page-form.jsx';
import React from 'react';

describe('MultiPageForm', () => {
    let wrapper;
    let submitted = false;

    beforeEach(() => {
        const props = {
            action: '//submit-somewhere',
            children: [<div className="page-1"/>, <div className="page-2" />, <div className="page-3" />],
            onSubmit() {
                submitted = true;
            }
        };

        wrapper = makeMountRender(MultiPageForm, props)();
    });

    it('handles next and submit', () => {
        expect(wrapper).toBeTruthy();
        let hiddenButtons = wrapper.find('button').filter({hidden: true});

        expect(hiddenButtons).toHaveLength(2);
        expect(hiddenButtons.at(0).text()).toBe('Back');
        wrapper.find('button.next').simulate('click');
        hiddenButtons = wrapper.find('button').filter({hidden: true});
        expect(hiddenButtons).toHaveLength(1);
        expect(hiddenButtons.at(0).text()).toBe('Submit');
        wrapper.find('button.next').simulate('click');
        hiddenButtons = wrapper.find('button').filter({hidden: true});
        expect(hiddenButtons).toHaveLength(1);
        expect(hiddenButtons.at(0).text()).toBe('Next');
        wrapper.find('button').find({type: 'submit'}).simulate('click');
        expect(submitted).toBe(true);
    });
});
