import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import Faq from '~/pages/openstax-tutor/faq';

describe('OpenStaxTutor', () => {
    const wrapper = makeMountRender(Faq, {
        model : {
            section6Heading: "Frequently asked questions",
            section6KnowledgeBaseCopy: "<p>Get more answers...</p>",
            faqs: [
                {
                    "type": "faq",
                    "value": {
                        "question": "<p>How much time does it take to set up my course in OpenStax Tutor Beta?</p>",
                        "slug": "how-much-time-to-set-up-course",
                        "answer": "<p>It takes 10-20 minutes to set up your OpenStax Tutor Beta account and create your course within the tool once you have your verified instructor account. Detailed page tips walk you through each feature of the tool step by step to help you hit the ground running. We manually verify every instructor account to make sure students don’t get access to instructor materials, so if you don’t yet have an instructor account with OpenStax, expect to wait 3-5 days for our Support Team to verify you.</p>",
                        "document": null
                    },
                    "id": "fb6cdaf3-0045-4392-a686-d809452bc2bd"
                }
            ]
        }
    })();

    it('has toggle-able FAQ entries', () => {
        const button = () => wrapper.find('[role="button"]');
        const toggler = () => button().find('.toggler.open');

        expect(toggler().length).toBe(0);
        button().simulate('click');
        expect(toggler().length).toBe(1);
    });
});
