import componentType from '~/helpers/controller/init-mixin';
import Quote from '~/components/quote/quote';
import css from './quotes.css';

const spec = {
    css,
    view: {
        classes: ['quotes']
    },
    regions: {
        quotes: '.quotes'
    }
};

export default class Quotes extends componentType(spec) {

    init(quotes) {
        super.init();
        this.view.classes.push(`boxes-${quotes.length}`);
        this.quoteViews = quotes.map((quote) => new Quote(quote));
    }

    onLoaded() {
        for (const view of this.quoteViews) {
            this.regions.self.append(view);
        }
    }

}
