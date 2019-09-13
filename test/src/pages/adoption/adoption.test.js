import AdoptionForm from '~/pages/adoption/adoption';
import instanceReady from '../../../helpers/instance-ready';

describe('AdoptionForm', () => {
    const {instance, ready} = instanceReady(AdoptionForm);

    it('hides role selector after first page', () =>
        ready.then(() => {
            expect(instance.roleSelector.isHidden).toBe(false);
            instance.onPageChange(1);
            expect(instance.roleSelector.isHidden).toBe(true);
        })
    );
});
