import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import GetThisTitle from '~/components/get-this-title-new/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import LetUsKnow from '../let-us-know/let-us-know';
import DetailsPane from './details-pane/details-pane';
import TocPane from './toc-pane/toc-pane';
import Contents from '~/pages/details/contents/contents';
import InstructorResourcePane from './instructor-resources-pane/instructor-resources-pane';
import StudentResourcePane from './student-resources-pane/student-resources-pane';
import ErrataPane from './errata-pane/errata-pane';
import {description as template} from './phone-view.html';

export default class PhoneView extends Controller {

    init(props) {
        this.template = template;
        this.props = props;
        this.css = `/app/pages/details/phone-view/phone-view.css?${VERSION}`;
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
        /* eslint complexity: 0 */
        $.insertHtml(this.el, this.props);
        this.regions.getTheBook.append(new GetThisTitle(this.props.bookInfo));
        const polish = (/^Fizyka/).test(this.props.bookTitle);
        const accordionItems = [
            {
                title: polish ? 'Szczegóły książki' : 'Book details',
                contentComponent: new DetailsPane(this.props.detailsTabData)
            },
            {
                title: 'Instructor resources',
                contentComponent: new InstructorResourcePane({
                    resources: this.props.instructorResources,
                    userStatusPromise: this.props.userStatusPromise,
                    compCopyDialogProps: this.props.compCopyDialogProps
                })
            },
            {
                title: 'Student resources',
                openTitle: `Student resources (${this.props.studentResources.length})`,
                contentComponent: new StudentResourcePane({
                    resources: this.props.studentResources,
                    userStatusPromise: this.props.userStatusPromise
                })
            },
            {
                title: polish ? 'Zgłoś erratę' : 'Report errata',
                contentComponent: new ErrataPane({
                    title: this.props.bookTitle,
                    errataBlurb: this.props.errataContent.content && this.props.errataContent.content.content
                })
            }
        ];

        if (polish) {
            accordionItems.splice(1, 2);
        }

        if (this.props.tableOfContents) {
            accordionItems.splice(1, 0, {
                title: polish ? 'Spis treści' : 'Table of contents',
                contentComponent: new TocPane({
                    polish,
                    webviewLink: this.props.webviewLink,
                    contentPane: new Contents(
                        this.props.tableOfContents,
                        {tag: 'ol', classes: ['table-of-contents']}
                    )
                })
            });
        }

        this.regions.accordion.append(new AccordionGroup(() => ({
            items: accordionItems
        })));
        this.regions.letUsKnow.append(new LetUsKnow(() => ({
            title: this.props.salesforceAbbreviation
        })));
    }

}
