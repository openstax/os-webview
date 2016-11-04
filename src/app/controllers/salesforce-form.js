import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';

class SalesforceForm extends CMSPageController {

    init() {
        this.slug = 'books';
    }

    onDataLoaded() {
        const seenTitles = {};

        this.salesforceTitles = Object.keys(this.pageData.books)
        .map((key) => this.pageData.books[key])
        .filter((book) => {
            const abbrev = book.salesforce_abbreviation;
            const seen = abbrev in seenTitles;

            seenTitles[abbrev] = true;
            return abbrev && !seen;
        })
        .map((book) => ({
            text: book.salesforce_name,
            value: book.salesforce_abbreviation,
            comingSoon: book.coming_soon
        }))
        .sort((a, b) => a.text < b.text ? -1 : 1);
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form :invalid');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        }
    }

    @on('submit form')
    changeSubmitMode() {
        this.submitted = true;
        this.update();
    }

}

export default SalesforceForm;
