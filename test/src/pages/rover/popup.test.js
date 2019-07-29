import '../../../helpers/fetch-mocker';
import PopupContent from '~/pages/rover-3/popup/popup';
import {doKeyDown} from '../../../test-utils';

const model = {
    headline: 'the headline',
    instructions: 'the instructions',
    loginUrl: 'http://example.com',
    signInText: 'Sign in',
    otherOptionUrl: 'http://example.com/other',
    otherOptionText: 'Do something else',
    image: ''
};

describe('Popup', () => {
    it('creates', () => {
        const popupContent = new PopupContent({
            model
        });
        const putAwayIcon = popupContent.el.querySelector('.close-popup');

        expect(popupContent).toBeTruthy();
        doKeyDown(putAwayIcon, 'Enter');
    });
});
