import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import LetUsKnow from '../let-us-know/let-us-know';
import DetailsPane from './details-pane/details-pane';
import Contents from '~/pages/details/contents/contents';
import InstructorResourcePane from './instructor-resources-pane/instructor-resources-pane';
import StudentResourcePane from './student-resources-pane/student-resources-pane';
import ErrataPane from './errata-pane/errata-pane';
import {description as template} from './phone-view.html';

export default class PhoneView extends Controller {

    init(model) {
        this.template = template;
        this.model = model;
        this.css = `/app/pages/details-new/phone-view/phone-view.css${VERSION}`;
        this.regions = {
            getTheBook: '.get-the-book',
            accordion: '.accordion-region',
            letUsKnow: '.let-us-know-region'
        };
        this.view = {
            classes: ['detail-phone-view']
        };
    }

    onLoaded() {
        // TODO Figure out heading levels: are the accordion titles headers?
        $.insertHtml(this.el, this.model);
        this.regions.getTheBook.append(new GetThisTitle(this.model.bookInfo));
        this.regions.accordion.append(new AccordionGroup(() => ({
            items: [
                {
                    title: 'Book details',
                    contentComponent: new DetailsPane(this.model.detailsTabData)
                },
                {
                    title: 'Table of contents',
                    contentComponent: new Contents(
                        this.model.tableOfContents,
                        {tag: 'ol', classes: ['table-of-contents']}
                    )
                },
                {
                    title: 'Instructor resources',
                    contentComponent: new InstructorResourcePane(this.model.instructorResources)
                },
                {
                    title: `Student resources (${this.model.studentResources.length})`,
                    contentComponent: new StudentResourcePane(this.model.studentResources)
                },
                {
                    title: 'Report errata',
                    contentComponent: new ErrataPane({
                        title: this.model.bookTitle
                    })
                }
            ]
        })));
        this.regions.letUsKnow.append(new LetUsKnow(() => ({})));
    }

}
