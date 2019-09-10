import '../../../helpers/document';
import '../../../helpers/create-object-url';
import SeparateMap from '~/pages/separatemap/separatemap';
import {clickElement} from '../../../test-utils';

describe('SeparateMap', () => {
    const instance = new SeparateMap();

    it('creates', () => {
        expect(instance).toBeTruthy();
    });

    it('has closeable popup', () => {
        const getPopupDiv = () => instance.el.querySelector('.popup-msg-div');
        const popupDiv = getPopupDiv();
        const closer = popupDiv.querySelector('.popup-msg-cross');

        expect(popupDiv).toBeTruthy();
        expect(closer).toBeTruthy();
        clickElement(closer);
        expect(getPopupDiv()).toBeFalsy();
    });
});
