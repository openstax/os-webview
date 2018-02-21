import {Controller} from 'superb.js';
import ResourceBox from '../../resource-box/resource-box';
// import {description as template} from './instructor-resources-pane.html';

export default class StudentResourcePane extends Controller {

    init(model) {
        // TODO Figure out how to distinguish free from paid
        this.model = model;
        this.template = () => '';
        // this.regions = {
        //     resources: '.resources-region'
        // };
        this.view = {
            classes: ['student-resources-pane']
        };
        this.css = '/app/pages/details-new/phone-view/student-resources-pane/student-resources-pane.css';
    }

    onLoaded() {
        for (const res of this.model) {
            const component = new ResourceBox(res);

            this.regions.self.append(component);
        }
    }

}
