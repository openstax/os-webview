import '../../helpers/fetch-mocker';
import {default as showAdoptionsIfNeeded, AdoptionDialog} from '~/components/shell/adoption-dialog/adoption-dialog';
import {clickElement} from '../../test-utils';

describe('AccordionGroup', () => {
    const response = {
        id: 23,
        accounts_id: 23,
        email: 'o1508651@mvrht.com',
        first_name: 'Charles',
        groups: ['faculty', 'OpenStax Tutor'],
        last_name: 'Morris',
        pending_verification: false,
        username: 'teacher01',
        self_reported_role: 'instructor'
    };
    const adoptions = [{
        'opportunity_id': '0061800000Ad4YXAAZ',
        'account_id': '315530',
        'book_name': 'American Government',
        'email': 'bf22+52@rice.edu',
        'school': 'Rice University',
        'yearly_students': '13.0',
        'updated': null
    }];
    const p = new AdoptionDialog({
        firstName: response.first_name,
        lastName: response.last_name,
        accountsId: response.accounts_id,
        email: response.email,
        role: response.self_reported_role,
        currentAdoption: 0,
        adoptions: adoptions.map((obj) => ({
            title: obj.book_name,
            students: Number(obj.yearly_students),
            using: true,
            school: obj.school
        }))
    });
    it('creates', () => {
        expect(p).toBeTruthy();
    });
    it('selects not using', () => {
        const el = p.el.querySelector('[name="using-0"]:not(checked)');

        clickElement(el);
        expect(el.checked).toBe(true);
    });
    it('lets you add a book', () => {
        const el = p.el.querySelector('a[role="button"]');

        clickElement(el);
        const sel = p.el.querySelector('select');
        expect(sel).toBeTruthy();
        expect(sel.value).toBe(sel.options[0].value);
        const newOpt = Array.from(sel.options)[3].value;
        sel.value = newOpt;
        expect(sel.value).toBe(newOpt);
    });
});
