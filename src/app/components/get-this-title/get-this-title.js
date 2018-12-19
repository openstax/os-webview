import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import router from '~/router';
import shell from '~/components/shell/shell';
import TocDialog from './toc-dialog/toc-dialog';
import OrderPrintCopy from './order-print-copy/order-print-copy';
import {highSchoolSlugs} from '~/models/book-titles';
import {description as template} from './get-this-title.html';
import {description as polishTemplate} from './get-this-title-polish.html';
import css from './get-this-title.css';

export default class GetThisTitle extends Controller {

    init(data) {
        const polish = $.isPolish(data.title);
        const isHighSchool = highSchoolSlugs.includes(data.slug);
        // It may or may not come in as an array
        const ensureArray = (content) => {
            if (content) {
                return []
                    .concat(data.bookstore_content)
                    .filter((entry) => entry.heading)
                    .sort((a, b) => a.button_url ? 1 : -1);
            }
            return [];
        };
        const arrayOfBookstoreContent = ensureArray(data.bookstore_content);

        this.template = polish ? polishTemplate : template;
        this.css = css;
        this.regions = {
            submenu: '.submenu'
        };
        this.view = {
            classes: ['get-this-title']
        };

        const printLink = [
            data.amazon_link,
            arrayOfBookstoreContent.some((obj) => obj.button_url),
            isHighSchool
        ].some((x) => x);

        this.submenu = '';
        this.model = () => ({
            includeTOC: data.includeTOC,
            tocHiddenAttribute: '',
            tableOfContents: data.table_of_contents,
            modalHiddenAttribute: '',
            ibookLink: data.ibook_link,
            ibookLink2: data.ibook_link_volume_2,
            kindleLink: data.kindle_link,
            webviewLink: data.webview_link,
            comingSoon: data.book_state === 'coming_soon',
            bookshareLink: data.bookshare_link,
            pdfText: polish ? ' Pobierz książkę' : ' Download a PDF',
            pdfLink: (data.high_resolution_pdf_url || data.low_resolution_pdf_url),
            sampleText: polish ? ' przykład' : ' sample',
            printLink,
            submenu: this.submenu,
            hiRes: data.high_resolution_pdf_url,
            loRes: data.low_resolution_pdf_url,
            slug: data.slug,
            cheggLink: data.chegg_link,
            cheggLinkText: data.chegg_link_text
        });
        this.printCopyContent = new OrderPrintCopy({
            amazonLink: data.amazon_link,
            amazonPrice: data.amazon_price,
            bulkLink: isHighSchool ? `/bulk-order?${data.slug}` : null,
            bookstoreContent: arrayOfBookstoreContent
        }, () => {
            shell.hideDialog();
        });
    }

    onLoaded() {
        const model = this.model();

        if (model.tableOfContents) {
            this.tocContent = new TocDialog({
                tableOfContents: model.tableOfContents,
                webviewLink: model.webviewLink
            });
        }
    }

    onClose() {
        // If they navigate while a modal is open
        document.body.classList.remove('no-scroll');
    }

    @on('click .btn')
    blurAfterClick(event) {
        event.target.blur();
    }

    @on('click .show-print-submenu')
    showPrintSubment(event) {
        event.preventDefault();
        shell.showDialog(() => ({
            title: 'Order a print copy',
            content: this.printCopyContent
        }));
    }

    @on('click .submenu .remover')
    hideSubmenu() {
        this.submenu = '';
        this.update();
    }

    @on('keydown .submenu .remover')
    operateByKey(event) {
        if ([$.key.space, $.key.enter].includes(event.keyCode)) {
            event.preventDefault();
            this.hideSubmenu();
        }
    }

    @on('click .show-toc')
    showToc(event) {
        event.preventDefault();
        shell.showDialog(() => ({
            title: 'Table of contents',
            content: this.tocContent
        }));
    }

}
