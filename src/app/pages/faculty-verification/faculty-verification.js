import ProxyWidgetView from '~/helpers/backbone/proxy-widget-view';
import userModel from '~/models/usermodel';
import salesforceModel from '~/models/salesforce-model';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './faculty-verification.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import './faculty-verification.css!';

@props({
    template: template,
    templateHelpers: {
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
