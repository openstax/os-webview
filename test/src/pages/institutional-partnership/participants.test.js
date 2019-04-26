import Participants from '~/pages/institutional-partnership/sections/participants/participants';
import shellBus from '~/components/shell/shell-bus';
import {clickElement} from '../../../test-utils';

describe('Participants', () => {
    it('handles click', () => {
        const p = new Participants({
            model: {
                icons: []
            }
        });
        const clickables = p.el.querySelectorAll('.show-established-partners');

        expect(clickables.length).toBe(1);
        const dialogShown = new Promise((resolve) => {
            shellBus.on('showDialog', resolve, 'once');
            clickElement(clickables[0]);
        });

        return dialogShown;
    });
});
