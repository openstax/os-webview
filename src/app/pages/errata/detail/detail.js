import {Controller} from 'superb';
import $ from '~/helpers/$';
import {bookPromise} from '~/models/book-titles';
import settings from 'settings';
import {description as template} from './detail.html';

export default class Detail extends Controller {

    static detailPromise(id) {
        return new Promise((resolve, reject) => {
            fetch(`${settings.apiOrigin}/api/errata/${id}`)
                .then((r) => r.json())
                .then((detail) =>
                    bookPromise.then((bookList) => {
                        const entry = bookList.find((info) => info.id === detail.book);

                        detail.bookTitle = entry ? entry.title : '(unknown book ID)';
                        resolve(detail);
                    })
                )
                .catch((e) => {
                    reject(e);
                });
        });
    }

    init(detail) {
        this.template = template;
        this.css = '/app/pages/errata/detail/detail.css';
        detail.date = new Date(detail.created).toLocaleDateString();
        detail.source = detail.resource;
        if (!(/^\/errata/).test(window.location.pathname)) {
            detail.id = `<a href="/errata/${detail.id}">${detail.id}</a>`;
        }
        this.model = {
            detail,
            mailSubject: encodeURIComponent(`Question on Errata #${detail.id}`),
            mailBody: encodeURIComponent(`I have a question about my errata submission ${window.location.href}`),
            detailDataPairs: [
                ['Submission ID', 'id'], ['Title', 'bookTitle'], ['Source', 'source'],
                ['Status', 'displayStatus'],
                ['Error Type', 'error_type'], ['Location', 'location'],
                ['Description', 'detail'], ['Date Submitted', 'date']
            ],
            decisionDataPairs: [
                ['Decision', 'displayStatus'], ['Decision details', 'resolution_notes']
            ],
            showDetails: detail.barStatus || detail.displayStatus === 'Will Correct'
        };
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}
