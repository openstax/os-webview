import {Controller} from 'superb';
import Contents from './contents';
import {description as template} from './content-item.html';

export default class ContentItem extends Controller {

    init({model, number, tag, startFrom}) {
        this.template = template;
        this.view = { tag };
        this.model = model;
        this.model.number = number;
        this.model.startFrom = startFrom;
    }

    onLoaded() {
        if (this.model.contents) {
            this.regions.self.append(new Contents(this.model, {tag: 'ol', classes: ['subunit']}));
        }
    }

}
