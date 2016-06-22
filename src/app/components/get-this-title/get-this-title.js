import {Controller} from 'superb';
// import Model from '~/models/model';
import PdfSubmenu from './pdf-submenu/pdf-submenu';
import PrintSubmenu from './print-submenu/print-submenu';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './get-this-title.html';

export default class GetThisTitle extends Controller {

    init(data) {
        this.template = template;
        this.css = '/app/components/get-this-title/get-this-title.css';
        this.regions = {
            submenu: '.submenu'
        };

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

        /*
        this.stateModel = new Model({
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
        */
    }

    /*
    onLoaded() {
        this.regions.submenu.append(this.pdfSubmenu);
        this.regions.submenu.append(this.printSubmenu);
        // FIX: listenTo vs on
        // FIX: Move DOM manipulation into template
        this.stateModel.on('change:currentSubmenu', (what) => {
            if (what.changed.currentSubmenu) {
                this.regions.submenu.el.classList.add(what.changed.currentSubmenu);
            } else {
                this.regions.submenu.el.classList.remove(this.stateModel.previous('currentSubmenu'));
            }
        });
    }

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
    */

}
