import mix from '~/helpers/controller/mixins';
import cmsMixin from '~/helpers/controller/cms-mixin';
import {Controller} from 'superb.js';

export default mix(Controller).with(cmsMixin);
