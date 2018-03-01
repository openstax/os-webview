import VERSION from '~/version';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './collapsing-pane.html';

export default class CollapsingPane extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.view = {
            classes: ['collapsing-pane']
        };
        this.css = `/app/components/collapsing-pane/collapsing-pane.css?${VERSION}`;
        this.regions = {
            content: '.content-region'
        };
        this.setOpen(false);
    }

    onLoaded() {
        if (this.model.contentComponent) {
            this.regions.content.attach(this.model.contentComponent);
        }
    }

    setOpen(whether) {
        this.isOpen = whether;
        if (whether) {
            this.model.plusOrMinus = 'minus';
            this.model.hiddenAttribute = null;
        } else {
            this.model.plusOrMinus = 'plus';
            this.model.hiddenAttribute = '';
        }
    }

    @on('click .control-bar')
    toggleOpen() {
        this.setOpen(!this.isOpen);
        this.update();
    }

}
