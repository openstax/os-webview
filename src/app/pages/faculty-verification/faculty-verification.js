import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import userModel from '~/models/usermodel';
import salesforceModel from '~/models/salesforce-model';
import bookTitles from '~/helpers/book-titles';
import salesforce from '~/helpers/salesforce';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './faculty-verification.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

@props({
    template: template,
    css: '/app/pages/faculty-verification/faculty-verification.css',
    templateHelpers: {
        titles: bookTitles,
        urlOrigin: window.location.origin,
        strips
    }
})
export default class FacultyVerificationForm extends ProxyWidgetView {
    @on('change [type=text],[type=email]')
    saveSetting(event) {
        let varName = event.target.name;

        if (varName) {
            salesforceModel.set(varName, event.target.value);
        }
    }

    onRender() {
        this.el.classList.add('faculty-verification-form');
        salesforce.populateAdoptionStatusOptions(this.el);
        super.onRender();
        userModel.fetch().then((data) => {
            let userInfo = data[0];

            if (userInfo) {
                this.el.querySelector('[name=user_id]').value = userInfo.username;
                this.el.querySelector('[name=OS_Accounts_ID__c]').value = userInfo.accounts_id;
            }
        });
        salesforceModel.prefill(this.el);
    }
}
