import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import router from '~/router';
import PdfSubmenu from './pdf-submenu/pdf-submenu';
import PrintSubmenu from './print-submenu/print-submenu';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './get-this-title.hbs';

@props({
    template: template,
    css: '/app/components/get-this-title/get-this-title.css',
    regions: {
        submenu: '.submenu'
    }
})
export default class GetThisTitle extends BaseView {
    @on('click .show-pdf-submenu')
    showPdfSubmenu(event) {
        event.preventDefault();
        this.stateModel.set('currentSubmenu', 'pdf');
    }

    @on('click .show-print-submenu')
    showPrintSubment(event) {
        event.preventDefault();
        this.stateModel.set('currentSubmenu', 'print');
    }

    @on('click a[href*="cnx.org/contents"]')
    showGiveOnDownload() {
        router.navigate('/give', true);
    }

    constructor(data) {
        super();
        this.templateHelpers = {
            ibookLink: data.ibook_link,
            ibookLink2: data.ibook_link_volume_2,
            webviewLink: data.webview_link,
            comingSoon: data.webview_link === '',
            conceptCoachLink: data.concept_coach_link,
            bookshareLink: data.bookshare_link,
            pdfLink: (data.high_resolution_pdf_url || data.low_resolution_pdf_url),
            printLink: (data.amazon_link || data.bookstore_link)
        };
        this.stateModel = new BaseModel({
            currentSubmenu: null
        });
        this.pdfSubmenu = new PdfSubmenu({
            hiRes: data.high_resolution_pdf_url,
            loRes: data.low_resolution_pdf_url
        }, this.stateModel);
        this.printSubmenu = new PrintSubmenu({
            amazon: {
                link: data.amazon_link,
                price: data.amazon_price,
                blurb: data.amazon_blurb
            },
            bookstore: {
                link: data.bookstore_link,
                blurb: data.bookstore_blurb
            }
        }, this.stateModel);
    }

    onRender() {
        this.regions.submenu.append(this.pdfSubmenu);
        this.regions.submenu.append(this.printSubmenu);
        this.stateModel.on('change:currentSubmenu', (what) => {
            let newValue = what.changed.currentSubmenu;

            if (newValue) {
                this.regions.submenu.el.classList.add(newValue);
            } else {
                this.regions.submenu.el.classList.remove(this.stateModel.previous('currentSubmenu'));
            }
        });
    }
}
