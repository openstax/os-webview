import VERSION from '~/version';
import {Controller} from 'superb.js';

export default class SeriesOfComponents extends Controller {

    init({className, contents}) {
        this.template = () => null;
        this.className = className;
        this.contents = contents;
    }

    onLoaded() {
        this.el.classList.add(this.className);
        this.contents.forEach((component) => this.regions.self.append(component));
    }

}
