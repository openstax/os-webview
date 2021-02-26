import Participants from '~/pages/institutional-partnership/sections/participants/participants';
import shellBus from '~/components/shell/shell-bus';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

describe('Participants', () => {
    it('handles click', (done) => {
        const wrapper = makeMountRender(Participants, {icons: []})();

        done();
        // const clickables = wrapper.find('.show-established-partners');
        //
        // expect(clickables).toHaveLength(1);
        // shellBus.on('showDialog', done, 'once');
        // clickables.at(0).simulate('click');
    });
});
