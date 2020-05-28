import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import salesforceFormMixin from '~/helpers/controller/salesforce-form-mixin';
import {description as template} from './adoption-dialog.html';
import css from './adoption-dialog.css';
import accountsModel from '~/models/usermodel';
import shellBus from '../shell-bus';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import salesforce from '~/models/salesforce';

const salesforceEndpointPrefix = `${$.apiOriginAndOldPrefix}/salesforce`;
const spec = {
    template,
    css,
    view: {
        classes: ['adoption-dialog']
    },
    model() {
        const adoptions = this.adoptions.map((obj) => {
            return Object.assign(
                {},
                obj,
                {
                    using: $.booleanAttribute(obj.using),
                    notUsing: $.booleanAttribute(!obj.using),
                    studentsDisabled: $.booleanAttribute(!obj.using),
                    status: obj.using ? 'Confirmed Adoption Won' : 'Not using'
                });
        });

        return {
            action: salesforce.webtoleadUrl,
            salesforce,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            accountsId: this.accountsId,
            role: this.role,
            currentAdoption: adoptions[this.currentAdoption],
            adoptions,
            allowMore: this.salesforceTitles && adoptions.length > 0 && adoptions.slice(-1)[0].title !== '',
            books: this.salesforceTitles,
            alreadySelected: (v) => {
                const found = this.adoptions.find((obj) => obj.title === v);

                return $.booleanAttribute(found);
            },
            notReadyToSubmit: $.booleanAttribute(this.notReadyToSubmit())
        };
    },
    slug: ''
};

export class AdoptionDialog extends componentType(spec, busMixin, salesforceFormMixin) {

    beforeSubmit() {
        this.adoptions = this.adoptions.filter((obj) => !(obj.new && !obj.using));
        if (this.adoptions.length < 1) {
            this.done();
            return;
        }

        const realForm = this.el.querySelector('form[target]');
        const responseEl = this.el.querySelector('#form-response');
        const afterSubmit = () => {
            ++this.currentAdoption;
            if (this.currentAdoption < this.adoptions.length) {
                this.update();
                this.beforeSubmit();
            } else {
                responseEl.removeEventListener('load', afterSubmit);
                fetch(
                    `${salesforceEndpointPrefix}/renewal/update/${this.accountsId}`,
                    {
                        method: 'POST'
                    }
                ).then(() => {
                    this.done();
                });
            }
        };

        if (!this.listeningForResponse) {
            this.listeningForResponse = true;
            responseEl.addEventListener('load', afterSubmit);
        }
        realForm.submit();
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.update();
    }

    done() {
        shellBus.emit('hideDialog');
        this.detach();
    }

    notReadyToSubmit() {
        return this.adoptions.find((obj) => obj.title === '');
    }

    @on('change select[name="title"]')
    updateTitle(event) {
        const target = event.delegateTarget;
        const index = target.closest('tr').dataset.index;

        this.adoptions[index].title = target.value;
        this.update();
    }

    @on('change [name^="using"]')
    changeUsing(event) {
        const target = event.delegateTarget;
        const index = target.closest('tr').dataset.index;

        this.adoptions[index].using = Boolean(Number(target.value));
        this.update();
    }

    @on('input [name="students"]')
    changeStudents(event) {
        const target = event.delegateTarget;
        const index = target.closest('tr').dataset.index;

        this.adoptions[index].students = target.value;
        this.update();
    }

    @on('click [type="button"]')
    removeEntry(event) {
        const target = event.delegateTarget;
        const index = target.closest('tr').dataset.index;

        this.adoptions.splice(index, 1);
        this.update();
    }

    @on('click .final-row a')
    addRow(event) {
        event.preventDefault();
        this.adoptions.push({
            title: '',
            students: 1,
            using: true,
            new: true
        });
        this.update();
    }

}

function getAdoptions(accountId) {
    // Uncomment ONLY to test:
    // return Promise.resolve([{
    //     'opportunity_id': '0061800000Ad4YXAAZ',
    //     'account_id': '315530',
    //     'book_name': 'American Government',
    //     'email': 'bf22+52@rice.edu',
    //     'school': 'Rice University',
    //     'yearly_students': '13.0',
    //     'updated': null
    // }]);
    return fetch(`${salesforceEndpointPrefix}/renewal/?account_id=${accountId}`)
        .then((r) => r.json());
}

export default function showIfNeeded() {
    accountsModel.load().then(
        (response) => {
            // Uncomment ONLY to test:
            // Object.assign(response, {
            //     id: 23,
            //     accounts_id: 23,
            //     email: 'o1508651@mvrht.com',
            //     first_name: 'Charles',
            //     groups: ['faculty', 'OpenStax Tutor'],
            //     last_name: 'Morris',
            //     pending_verification: false,
            //     username: 'teacher01',
            //     self_reported_role: 'instructor'
            // });

            if (typeof response.id !== 'undefined') {
                getAdoptions(response.id).then((adoptions) => {
                    if (adoptions.length < 1) {
                        return;
                    }

                    const adoptionDialog = new AdoptionDialog({
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

                    shellBus.emit('showDialog', () => ({
                        title: 'Please confirm your adoptions below',
                        content: adoptionDialog
                    }));
                    adoptionDialog.on('close', () => {
                        adoptionDialog.done();
                    });
                });
            }
        },
        (err) => {
            console.warn('Did not get response', err);
        }
    );
}
