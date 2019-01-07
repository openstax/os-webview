import $ from '~/helpers/$';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './annual-report.html';
import css from './annual-report.css';
import createSection from './section/section';

function camelCase(underscored) {
    return underscored.replace(/_([a-z])/g, (_, chr) => chr ? chr.toUpperCase() : '');
}

function camelCaseKeys(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v));
    }

    const result = {};

    Reflect.ownKeys(obj).forEach((k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]);
    });

    return result;
}

const spec = {
    template,
    css,
    view: {
        classes: ['annual-report', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/annual-report',
    preserveWrapping: true,
    model: null
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class AnnualReport extends BaseClass {

    onLoaded() {
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-loading');
    }

    setModel() {
        const result = {};

        Reflect.ownKeys(this.pageData)
            .filter((k) => this.pageData[k] instanceof Array)
            .forEach((k) => {
                const values = this.pageData[k];
                const newEntry = {};

                values.forEach((v) => {
                    newEntry[camelCase(v.type)] = camelCaseKeys(v.value);
                });

                result[camelCase(k)] = newEntry;
            });

        this.model = result;
        // Some things that might not exist and need to or the page breaks
        const setIfNotFound = function (parent, kvPairs) {
            kvPairs.forEach((pair) => {
                const [key, value] = pair;

                if (!(key in parent)) {
                    parent[key] = value;
                }
            });
        };
        const placeholderImage = {
            image: 'https://via.placeholder.com/400x400/027/359?text=image',
            imageAlt: 'image not defined in CMS'
        };
        const bottomBorderImage = {
            image: 'https://via.placeholder.com/1400x220/DDF/359?text=border-image',
            imageAlt: 'image not defined in CMS'
        };

        setIfNotFound(result.improvingAccess, [
            [
                'backgroundImage',
                {
                    image: 'https://via.placeholder.com/1400x600/027/359?text=background'
                }
            ]
        ]);
        setIfNotFound(result.disruption, [['graph', placeholderImage]]);
        setIfNotFound(result.map, [
            [
                'backgroundImage',
                {
                    image: 'https://via.placeholder.com/1400x600/68c/359?text=map%20background'
                }
            ],
            ['image1', placeholderImage],
            ['image2', placeholderImage]
        ]);
        setIfNotFound(result.philanthropicPartners, [
            ['link1', {}],
            ['link2', {}]
        ]);
        setIfNotFound(result.reach, [['facts', []]]);
        setIfNotFound(result.testimonials, [['testimonials', []]]);
        setIfNotFound(result.tutor, [
            ['rightImage', placeholderImage],
            ['bottomImage', bottomBorderImage]
        ]);
        setIfNotFound(result.revolution, [
            ['portrait', {image: placeholderImage, altText: 'default alt'}],
            ['signature', {image: placeholderImage, altText: 'default alt'}]
        ]);
    }

    onDataLoaded() {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
        this.setModel();
        this.update();
        this.insertHtml();

        const insertComponent = (id, modelKey = id, content=true) => {
            this.regionFrom(`#${id}`).attach(createSection(id, this.model[modelKey], content));
        };

        insertComponent('banner', 'improvingAccess');
        insertComponent('founding');
        insertComponent('reach');
        insertComponent('revolution');
        insertComponent('testimonials');
        insertComponent('sustainability');
        insertComponent('lookingAhead');
        insertComponent('disruption');
        insertComponent('philanthropic-partners', 'philanthropicPartners');
        insertComponent('giving');
        insertComponent('map', 'map', false);
        insertComponent('tutor', 'tutor', false);
    }

}
