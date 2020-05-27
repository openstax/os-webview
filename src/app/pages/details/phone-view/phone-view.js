import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import WrappedJsx from '~/controllers/jsx-wrapper';
import LetUsKnow from '../let-us-know/let-us-know.jsx';
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
        const includeTOC = ['live', 'new_edition_available'].includes(this.props.bookInfo.book_state);
        const isRex = this.props.isRex;
        const webviewLink = this.props.webviewLink;

        /* eslint complexity: 0 */
        super.onLoaded();
        this.regions.getTheBook.append(new GetThisTitle(
            Object.assign(
                {
                    includeTOC,
                    isRex,
                    isTutor: this.props.isTutor,
                    webviewLink
                }, this.props.bookInfo
            )
        ));
        const polish = this.props.polish;
        const accordionItems = [
            {
                title: polish ? 'Szczegóły książki' : 'Book details',
                contentComponent: new DetailsPane(this.props.detailsTabData)
            },
            {
                title: 'Instructor resources',
                titleTag: 'updated',
                contentComponent: new InstructorResourcePane({
                    featuredResourcesHeader: this.props.featuredResourcesHeader,
                    featuredResources: this.props.featuredResources,
                    otherResources: this.props.otherResources,
                    userStatusPromise: this.props.userStatusPromise,
                    compCopyDialogProps: this.props.compCopyDialogProps,
                    bookAbbreviation: this.props.salesforceAbbreviation,
                    communityResource: this.props.communityResource
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
            accordionItems.splice(1, 0, {
                title: polish ? 'Spis treści' : 'Table of contents',
                contentComponent: new TocPane({
                    isRex,
                    cnxId: this.props.bookInfo.cnx_id,
                    webviewLink
                })
            });
        }

        if (['live', 'new_edition_available'].includes(this.props.bookState)) {
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
            const letUsKnow = new WrappedJsx(
                LetUsKnow,
                {title: titleArg},
                this.regions.letUsKnow.el
            );
        }
    }

}
