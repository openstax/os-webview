import VERSION from '~/version';
import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './general.html';
import Multicolumn from './multicolumn/multicolumn';

const spec = {
    template,
    css: `/app/pages/general/general.css?${VERSION}`,
    view: {
        classes: ['general', 'page'],
        tag: 'main'
    },
    slug: 'supplied-in-init',
    preserveWrapping: true
};

export default class General extends componentType(spec) {

    init() {
        super.init();
        this.slug = window.location.pathname.replace('general', 'pages');
    }

    onDataLoaded() {
        const data = this.pageData;

        this.model = () => ({
            title: data.title,
            body: data.body
        });
        this.update();
        this.insertHtml();
        data.body.forEach((item, index) => {
            if (item.type === 'image') {
                fetch(`https://oscms-dev.openstax.org/api/v2/images/${item.value}/`)
                    .then((r) => r.json())
                    .then((result) => {
                        item.file = result.file;
                        this.update();
                    });
            }
            if (item.type === 'multicolumn') {
                const region = this.regionFrom(`[data-region-for="${index}"]`);
                const component = new Multicolumn({
                    model: {
                        columns: item.value
                    }
                });

                region.attach(component);
            }
        });
    }

}
