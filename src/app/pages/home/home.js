import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';

const books = [
    'astronomy',
    'biology',
    'chemistry',
    'us-history'
];

@props({
    template: template,
    regions: {
        bookBanner: '.book-banner'
    }
})
export default class Home extends BaseView {

    onRender() {
        this.updateHeaderStyle();
        window.addEventListener('scroll', this.updateHeaderStyle.bind(this));

        // Lazy-load a random book
        this.showBookBanner(books[Math.floor(Math.random()*books.length)]);
    }

    showBookBanner(book) {
        let view = this;

        System.import(`~/pages/home/banners/${book}/${book}`).then((m) => {
            let Page = m.default;

            view.regions.bookBanner.show(new Page());
            view.currentBookBanner = book;
        });
    }

    updateHeaderStyle() {
        if (!appView.header) {
            return;
        }

        let secondaryNavHeight = appView.header.secondaryNavHeight;

        if (window.pageYOffset > secondaryNavHeight && !appView.header.isPinned()) {
            let height = appView.header.height;

            appView.header.reset().collapse().pin();
            this.el.style.paddingTop = `${height / 10}rem`;
        } else if (window.pageYOffset <= secondaryNavHeight && !appView.header.isTransparent()) {
            appView.header.reset().transparent();
            this.el.style.paddingTop = '0';
        }
    }

    onBeforeClose() {
        window.removeEventListner('scroll', this.updateHeaderStyle.bind(this));
    }

}
