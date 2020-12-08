import Participants from '~/pages/institutional-partnership/sections/participants/participants';
import shellBus from '~/components/shell/shell-bus';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

describe('Participants', () => {
    it('handles click', () => {
        const wrapper = makeMountRender(Participants, {icons: []})();
        const clickables = wrapper.find('.show-established-partners');

        expect(clickables).toHaveLength(1);
        const dialogShown = new Promise((resolve) => {
            shellBus.on('showDialog', resolve, 'once');
            clickables.at(0).simulate('click');
        });

        return dialogShown;
    });
});
