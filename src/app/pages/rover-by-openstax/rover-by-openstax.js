import VERSION from '~/version';
import $ from '~/helpers/$';
import CMSPageController from '~/controllers/cms';
import ContentGroup from '~/components/content-group/content-group';
import InfoPane from './info-pane/info-pane';
import salesforce from '~/models/salesforce';
import SignupForm from './signup-form/signup-form';
import TabGroup from '~/components/tab-group/tab-group';
import {description as template} from './rover-by-openstax.html';
import {on} from '~/helpers/controller/decorators';

const rolesPromise = fetch(`${settings.apiOrigin}/api/snippets/roles`)
    .then((r) => r.json());

export default class Rover extends CMSPageController {

    init() {
        this.template = template;
        this.view = {
            classes: ['rover', 'page'],
            tag: 'main' // if the HTML doesn't contain a main tag
        };
        this.css = `/app/pages/rover-by-openstax/rover-by-openstax.css?${VERSION}`;
        this.slug = 'pages/rover-by-openstax';
        this.model = () => this.getModel();

        // State
        this.faqItems = [];
    }

    toFaqCards(faqs) {
        const result = faqs.map((f) => {
            return Object.assign({
                chevronDirection: 'left'
            }, f);
        });

        return result;
    }

    toSection3Cards(cardData) {
        return cardData.map((d) => {
            const v = d.value;

            return {
                iconUrl: v.image.link,
                description: v.description,
                buttonUrl: v.button_url,
                buttonText: v.headline
            };
        });
    }

    getModel() {
        if (!this.pageData) {
            return {};
        }

        const data = this.pageData;

        /* eslint camelcase: 0 */
        return {
            loaded: true,
            headerImage: data.header_image || '/images/rover-by-openstax/logo-desktop.png',
            mobileHeaderImage: data.mobile_header_image || '/images/rover-by-openstax/logo-mobile.png',
            headerImageAltText: data.header_image_alt,
            headline: data.section_1_headline,
            introHtml: data.section_1_description,
            button1Text: data.section_1_button_text,
            button1Url: data.section_1_button_url,
            headline2: data.section_2_headline,
            headline3: data.section_3_headline,
            description3: data.section_3_description,
            cards: this.toSection3Cards(data.rover_cards_section_3[0].cards),
            formHeadline: this.formHeadlineReplacement || data.form_headline,
            headline4: data.section_4_headline,
            faqCards: this.faqItems, // calculated in onDataLoaded
            salesforce
        };
    }

    contentsFromPageData() {
        const result = {};

        this.pageData.rover_cards_section_2.forEach((t) => {
            const cards = t.cards.map((c) => c.value);

            result[t.heading] = new InfoPane({
                descriptionHtml: t.description,
                cards
            });
        });

        return result;
    }

    populateTabs() {
        const Region = this.regions.self.constructor;
        const tabRegion = new Region(this.el.querySelector('.tabs'), this);
        const tabContentRegion = new Region(this.el.querySelector('.tab-content'), this);
        const contents = this.contentsFromPageData();
        const tabLabels = this.pageData.rover_cards_section_2.map((t) => t.heading);
        let selectedTab = tabLabels[1];
        const contentGroup = new ContentGroup(() => ({
            selectedTab,
            contents
        }));
        const tabGroup = new TabGroup(() => ({
            tag: 'h3',
            tabLabels,
            selectedTab,
            setSelected(newValue) {
                selectedTab = newValue;
                contentGroup.update();
            }
        }));

        tabRegion.attach(tabGroup);
        tabContentRegion.attach(contentGroup);
    }

    populateForm() {
        const Region = this.regions.self.constructor;
        const signupFormRegion = new Region(this.el.querySelector('.signup-form'));
        const iframe = document.createElement('iframe');

        this.signupForm = new SignupForm(this.roles);
        signupFormRegion.attach(this.signupForm);
        iframe.name = iframe.id = 'rover-form-response';
        iframe.width = iframe.height = '0';
        iframe.tabindex = '-1';
        iframe.classList.add('hidden');
        document.getElementById('form-response-region').appendChild(iframe);
    }

    onDataLoaded() {
        this.faqItems = this.toFaqCards(this.pageData.section_4_faqs[0]);
        this.update();
        $.insertHtml(this.el, this.model);
        this.populateTabs();
        rolesPromise.then((roles) => {
            this.roles = roles;
            this.populateForm();
        });
    }

    @on('click .faq-toggle')
    toggleFaqItem(event) {
        const itemIndex = event.delegateTarget.getAttribute('data-item');
        const model = this.getModel();
        const item = model.faqCards[itemIndex];

        item.chevronDirection = item.chevronDirection === 'left' ? 'down' : 'left';
        this.update();
    }

    @on('submit form')
    handleSubmit(event) {
        const afterSubmit = () => {
            this.listeningForResponse = false;
            this.formHeadlineReplacement = 'Thank you for signing up';
            if (this.signupForm) {
                this.signupForm.detach();
            }
            this.update();
            document.getElementById('rover-form-response').removeEventListener('load', afterSubmit);
        };

        if (!this.listeningForResponse) {
            this.listeningForResponse = true;
            document.getElementById('rover-form-response').addEventListener('load', afterSubmit);
        }
    }

}
