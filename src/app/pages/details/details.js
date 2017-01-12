import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import router from '~/router';
import DetailsLoaded from './details-loaded';

export default class Details extends CMSPageController {

    static uniDescription = 'is a peer-reviewed, free, open textbook ' +
        'that covers standard scope and sequence. Access the text, authors, ' +
        'and resources here.';

    static apDescription = 'is a peer-reviewed, free, open textbook ' +
        'that adheres to Advanced Placement® frameworks. Access the full ' +
        'text here.';

    init(bookTitle) {
        this.template = () => '';
        this.view = {
            classes: ['os-loader']
        };
        bookTitle = bookTitle.toLowerCase();
        if (/^books/.test(bookTitle)) {
            this.slug = bookTitle;
        } else {
            this.slug = `books/${bookTitle}`;
        }
    }

    onDataLoaded() {
        const textTitle = $.htmlToText(this.pageData.title);

        document.querySelector('head > meta[name="description"]').content =
            `${textTitle} ${this.pageData.is_ap ? Details.apDescription : Details.uniDescription}`;
        document.title = `${textTitle} - OpenStax`;

        const model = this.pageData;
        const authors = this.pageData.book_contributing_authors;
        const senior = (author) => author.senior_author;
        const nonsenior = (author) => !author.senior_author;
        const top = (author) => author.display_at_top;

        model.allSenior = authors.filter(senior);
        model.allNonsenior = authors.filter(nonsenior);
        model.topSenior = model.allSenior.filter(top);
        model.topNonsenior = model.allNonsenior.filter(top);

        if (model.license_name) {
            model.licenseIcon = model.license_name.match(/share/i) ?
            '/images/details/by-nc-sa.svg' : '/images/details/by.svg';
        }

        model.comingSoon = this.pageData.coming_soon ? ' coming-soon' : '';

        this.regions.self.attach(new DetailsLoaded(model));
    }

    onDataError() {
        router.navigate('/404');
    }

}
