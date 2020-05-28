import InstitutionalPartnership from '~/pages/institutional-partnership/institutional-partnership';
import instanceReady from '../../../helpers/instance-ready';

describe('InstitutionalPartnership', () => {
    it('creates', () => {
        const {instance, ready} = instanceReady(InstitutionalPartnership);

        expect(instance).toBeTruthy();
    });
});
