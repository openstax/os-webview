import $ from '~/helpers/$';
import FormSelect from '~/components/form-select/form-select';
import {description as template} from './technology.html';
import css from './technology.css';
import componentType, {canonicalLinkMixin} from '~/helpers/controller/init-mixin';
import Steps from './steps/steps';
import NewFrontier from './new-frontier/new-frontier';
import Banner from './banner/banner';

const spec = {
    template,
    css,
    view: {
        classes: ['technology-page', 'page']
    },
    slug: 'pages/technology'
};
const BaseClass = componentType(spec, canonicalLinkMixin);

export default class Technology extends BaseClass {

    onDataError(e) {
        console.warn(e);
    }

    onDataLoaded() {
        const data = this.pageData;

        this.model = true;
        this.update();
        this.regionFrom('#banner').attach(new Banner({
            model: {
                headline: data.intro_heading,
                description: data.intro_description,
                button: {
                    url: '#steps',
                    text: data.banner_cta
                }
            }
        }));
        this.regionFrom('#steps').attach(new Steps({
            model: {
                headline: data.select_tech_heading,
                items: [
                    {
                        selector: new FormSelect({
                            name: 'book',
                            placeholder: data.select_tech_step_1,
                            validationMessage: () => ''
                        })
                    },
                    {
                        description: data.select_tech_step_2,
                        hash: '?Instructor%20resources'
                    },
                    {
                        description: data.select_tech_step_3,
                        hash: '?Instructor%20resources#technology-options'
                    }
                ]
            }
        }));
        this.regionFrom('#tutor').attach(new NewFrontier({
            model: {
                headline: data.new_frontier_heading,
                subhead: data.new_frontier_subheading,
                description: data.new_frontier_description,
                buttons: [
                    {
                        url: data.new_frontier_cta_link_1,
                        text: data.new_frontier_cta_1
                    },
                    {
                        url: data.new_frontier_cta_link_2,
                        text: data.new_frontier_cta_2
                    }
                ]
            }
        }));
        $.scrollToHash();
    }

}
