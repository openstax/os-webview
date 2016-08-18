import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import router from '~/router';
import {highSchoolSlugs} from '~/models/book-titles';
import {description as template} from './get-this-title.html';

export default class GetThisTitle extends Controller {

    init(data) {
        this.template = template;
        this.css = '/app/components/get-this-title/get-this-title.css';
        this.regions = {
            submenu: '.submenu'
        };

        const isHighSchool = highSchoolSlugs.includes(data.slug);

        this.model = {
            ibookLink: data.ibook_link,
            ibookLink2: data.ibook_link_volume_2,
            webviewLink: data.webview_link,
            comingSoon: data.webview_link === '',
            conceptCoachLink: data.concept_coach_link,
            bookshareLink: data.bookshare_link,
            pdfLink: (data.high_resolution_pdf_url || data.low_resolution_pdf_url),
            printLink: (data.amazon_link || data.bookstore_link || isHighSchool),
            submenu: '',
            hiRes: data.high_resolution_pdf_url,
            loRes: data.low_resolution_pdf_url,
            amazon: {
                link: data.amazon_link,
                price: data.amazon_price,
                blurb: data.amazon_blurb
            },
            bookstore: {
                link: data.bookstore_link,
                blurb: data.bookstore_blurb
            },
            slug: data.slug
        };
    }

    @on('click .show-pdf-submenu')
    showPdfSubmenu(event) {
        event.preventDefault();
        this.model.submenu = 'pdf';
        this.update();
    }

    @on('click .show-print-submenu')
    showPrintSubment(event) {
        event.preventDefault();
        this.model.submenu = 'print';
        this.update();
    }

    @on('click .submenu .remover')
    hideSubmenu() {
        this.model.submenu = '';
        this.update();
    }

    @on('click [href*="cnx.org/content"],:not(.show-pdf-submenu)[href$=".pdf"')
    showGive() {
        router.navigate('/give?student', {path: '/give?student'});
    }

}
