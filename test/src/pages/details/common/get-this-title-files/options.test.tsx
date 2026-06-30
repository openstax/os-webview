import React from 'react';
import {render, screen} from '@testing-library/preact';
import {IntlProvider} from 'react-intl';
import messages from '~/lang/en';
import {OptionExpander} from '~/pages/details/common/get-this-title-files/options';

describe('OptionExpander', () => {
    it('uses plural label text when there are multiple additional options', () => {
        render(
            <IntlProvider locale="en" messages={messages}>
                <OptionExpander
                    expanded={false}
                    additionalOptions={2}
                    toggle={jest.fn()}
                />
            </IntlProvider>
        );

        screen.getByRole('link', {name: '+ 2 more options...'});
    });
});
