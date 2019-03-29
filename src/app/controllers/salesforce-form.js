import {Controller} from 'superb.js';
import mix from '~/helpers/controller/mixins';
import cmsMixin from '~/helpers/controller/cms-mixin';
import salesforceFormMixin from '~/helpers/controller/salesforce-form-mixin';

export default mix(Controller).with(cmsMixin, salesforceFormMixin);
