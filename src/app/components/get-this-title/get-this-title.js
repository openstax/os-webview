import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import shellBus from '~/components/shell/shell-bus';
import OrderPrintCopy from './order-print-copy/order-print-copy';
import {description as template} from './get-this-title.html';
import {description as polishTemplate} from './get-this-title-polish.html';
import css from './get-this-title.css';

const spec = {
    template,
    css,
    regions: {
        submenu: '.submenu'
    },
    view: {
        classes: ['get-this-title']
    },
    submenu: '',
    tocActive: false
};

export default class GetThisTitle extends componentType(spec, busMixin) {

    init(data) {
        super.init();
        const polish = $.isPolish(data.title);
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

        const printLink = [
            data.amazon_link,
            arrayOfBookstoreContent.some((obj) => obj.button_url)
        ].some((x) => x);

        this.model = () => ({
            includeTOC: Boolean(data.table_of_contents),
            tocActive: this.tocActive,
            modalHiddenAttribute: '',
            ibookLink: data.ibook_link,
            ibookLink2: data.ibook_link_volume_2,
            kindleLink: data.kindle_link,
            webviewLink: data.webview_link,
            rexwebviewLink: data.webview_rex_link,
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
            bookstoreContent: arrayOfBookstoreContent
        }, () => {
            shellBus.emit('hideDialog');
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.on('set-toc', (value) => {
            this.setToc(value);
        });
    }

    setToc(value) {
        this.tocActive = value;
        this.update();
        this.emit('toc', this.tocActive);
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
    showPrintSubmenu(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => ({
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
        this.setToc(!this.tocActive);
    }

}
