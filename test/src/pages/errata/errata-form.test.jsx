import React from 'react';
import TestRenderer from 'react-test-renderer';
import Form from '~/pages/errata-form/form/form.jsx';
import formModel from './form-model.js';

describe('ErrataForm/Form', () => {
    it ('Creates the React form', () => {
        const instance = TestRenderer.create(<Form model={formModel} />);

        expect(instance.toJSON()).toMatchSnapshot();
;    });
});
