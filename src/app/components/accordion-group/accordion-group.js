import WrappedJsx from '~/controllers/jsx-wrapper';
import mix from '~/helpers/controller/mixins';
import AccordionGroupJsx from './accordion-group.jsx';
import css from './accordion-group.css';
import busMixin from '~/helpers/controller/bus-mixin';

export default class extends mix(WrappedJsx).with(busMixin) {

    init(props) {
        super.init(AccordionGroupJsx, Object.assign({
            forwardOnChange: (openTabs) => {
                const selectedTab = openTabs && openTabs[0];

                this.emit('open', selectedTab);
            }
        }, props));
    }

    onLoaded() {
        super.onLoaded();
    }

}
