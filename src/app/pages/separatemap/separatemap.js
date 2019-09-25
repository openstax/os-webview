import componentType, {canonicalLinkMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import { on } from '~/helpers/controller/decorators';
import shellBus from '~/components/shell/shell-bus';
import { description as template } from './separatemap.html';
import css from './separatemap.css';
import SearchBox from './search-box/search-box';
import Map from '~/helpers/map-api';
import {queryById} from '~/models/querySchools';
import TestimonialForm from './testimonial-form/testimonial-form';
import {accountsModel} from '~/models/usermodel';

const spec = {
    template,
    css,
    regions: {
        searchBox: '.search-box-region'
    },
    view: {
        classes: ['separatemap', 'page'],
        tag: 'main',
        id: 'maincontent'
    },
    model() {
        return {
            popupVisible: this.popupVisible,
            searchBoxMinimized: this.searchBoxMinimized
        };
    },
    searchBoxMinimized: false,
    popupVisible: true
};
const accountPromise = accountsModel.load();

export default class SeparateMap extends componentType(spec, canonicalLinkMixin, loaderMixin) {

    onAttached() {
        shellBus.emit('with-sticky');
        const mapZoom = $.isMobileDisplay() ? 2 : 3;
        const map = new Map({
            container: 'mapd',
            center: [-95.712891, 37.090240],
            zoom: mapZoom,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false,
            interactive: true
        });
        const sb = new SearchBox({
            minimized: this.searchBoxMinimized
        });

        this.regions.searchBox.append(sb);
        sb.on('results', (results) => {
            map.showPoints(results);
        });
        sb.on('reset', () => map.reset());
        sb.on('show-details', (info) => {
            map.showTooltip(info, true);
        });
        sb.on('toggle-minimized', () => {
            this.searchBoxMinimized = !this.searchBoxMinimized;
            sb.emit('update-props', {
                minimized: this.searchBoxMinimized
            });
            this.update();
        });
        accountPromise.then((info) => {
            if (!('id' in info)) {
                return;
            }
            const formParameters = {
                role: info.self_reported_role,
                email: (info.contact_infos || [])
                    .filter((i) => i.is_verified)
                    .reduce((a, b) => (a.is_guessed_preferred ? a : b), {})
                    .value,
                school: info.self_reported_school,
                firstName: info.first_name,
                lastName: info.last_name
            };
            const newForm = () => {
                const tf = new TestimonialForm(formParameters);

                tf.on('close-form', () => {
                    shellBus.emit('hideDialog');
                    this.testimonialForm = null;
                });
                return tf;
            };

            sb.emit('update-props', {
                loggedIn: true
            });
            sb.on('submit-testimonial', () => {
                if (!this.testimonialForm) {
                    this.testimonialForm = newForm();
                }
                shellBus.emit('showDialog', () => ({
                    title: 'Submit your testimonial',
                    content: this.testimonialForm
                }));
            });
        });
        map.loaded.then(() => {
            this.hideLoader();
        });
        map.on('select-school', (id) => {
            queryById(id).then((schoolInfo) => {
                map.showTooltip(schoolInfo);
                sb.emit('show-one-school', schoolInfo);
            });
        });
    }

    @on('click .popup-msg-cross')
    popupClose() {
        if (!$.isMobileDisplay()) {
            this.popupVisible = false;
            this.update();
        }
    }

    onClose() {
        shellBus.emit('no-sticky');
    }


}
