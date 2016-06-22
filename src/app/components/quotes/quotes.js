import {Controller} from 'superb';
import Quote from './quote/quote';
import {description as template} from './quotes.html';

export default class Quotes extends Controller {

    init(quotes) {
        this.template = template;
        this.css = '/app/components/quotes/quotes.css';
        this.view = {
            classes: ['boxed']
        };
        this.regions = {
            quotes: '.quotes'
        };
        this.model = quotes;
    }

    onLoaded() {
        for (const quote of this.model) {
            // FIX: Append to self and remove HTML from template
            this.regions.quotes.append(new Quote(quote));
        }
    }

}
