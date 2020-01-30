import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import LetUsKnow from '../let-us-know/let-us-know';
import DetailsPane from './details-pane/details-pane';
import TocPane from '../table-of-contents/table-of-contents';
import InstructorResourcePane from './instructor-resources-pane/instructor-resources-pane';
import StudentResourcePane from './student-resources-pane/student-resources-pane';
import ErrataPane from './errata-pane/errata-pane';
import {description as template} from './phone-view.html';
import css from './phone-view.css';

const spec = {
    template,
    css,
    view: {
        classes: ['detail-phone-view']
    },
    regions: {
        getTheBook: '.get-the-book',
        accordion: '.accordion-region',
        letUsKnow: '.let-us-know-region'
    }
};

export default class PhoneView extends componentType(spec, insertHtmlMixin) {

    init(props) {
        super.init();
        this.props = props;
    }

    onLoaded() {
        /* eslint complexity: 0 */
        super.onLoaded();
        this.regions.getTheBook.append(new GetThisTitle(this.props.bookInfo));
        const polish = this.props.polish;
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
                    compCopyDialogProps: this.props.compCopyDialogProps,
                    bookAbbreviation: this.props.salesforceAbbreviation
                })
            },
            {
                title: 'Student resources',
                openTitle: `Student resources (${this.props.studentResources.length})`,
                contentComponent: new StudentResourcePane({
                    resources: this.props.studentResources,
                    userStatusPromise: this.props.userStatusPromise
                })
            }
        ];

        if (polish) {
            accordionItems.splice(1, 2);
        }

        if (this.props.includeTOC) {
            const bi = this.props.bookInfo;
            const isRex = Boolean(bi.webview_rex_link);
            const webviewLink = isRex ? bi.webview_rex_link : this.props.webviewLink;

            accordionItems.splice(1, 0, {
                title: polish ? 'Spis treści' : 'Table of contents',
                contentComponent: new TocPane({
                    isRex,
                    cnxId: bi.cnx_id,
                    webviewLink
                })
            });
        }

        if (this.props.bookState === 'live') {
            accordionItems.push({
                title: polish ? 'Zgłoś erratę' : 'Report errata',
                contentComponent: new ErrataPane({
                    polish,
                    title: this.props.bookTitle,
                    errataBlurb: this.props.errataContent.content && this.props.errataContent.content.content
                })
            });
        }

        this.regions.accordion.append(new AccordionGroup({
            items: accordionItems
        }));

        const titleArg = polish ? this.props.bookTitle : this.props.salesforceAbbreviation;

        if (titleArg) {
            this.regions.letUsKnow.append(new LetUsKnow(titleArg));
        }
    }

}
