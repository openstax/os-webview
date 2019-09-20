import TechnologySelector from '~/components/technology-selector/technology-selector';
import instanceReady from '../../helpers/instance-ready';

describe('TechnologySelector', () => {
    const {instance:p, ready} = instanceReady(TechnologySelector, {
        prompt: 'Which technologies?'
    });

    it ('lists technology partners', () =>
        ready.then(() => {
            const labels = Array.from(p.el.querySelectorAll('label:not(.field-label)'));

            expect(labels.length).toBe(48);
        })
    );

});
