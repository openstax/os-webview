import componentType from '~/helpers/controller/init-mixin';
import css from './institutional-partner-program.css';
import Banner from './sections/banner/banner';
import OverlappingQuote from './sections/overlapping-quote/overlapping-quote';
import About from './sections/about/about';
import Promoting from './sections/promoting/promoting';
import BigQuote from './sections/big-quote/big-quote';
import Speaking from './sections/speaking/speaking';
import Results from './sections/results/results';
import Participants from './sections/participants/participants';
import SmallQuote from './sections/small-quote/small-quote';
import SignUp from './sections/sign-up/sign-up';

const spec = {
    css,
    view: {
        classes: ['institutional-partner-program', 'page'],
        tag: 'main'
    },
    slug: 'pages/institutional-partner-program'
};

export default class extends componentType(spec) {

    onDataLoaded() {
        const data = this.pageData;

        this.regions.self.attach(new Banner({
            model: {
                heading: data.section_1_heading,
                description: data.section_1_description,
                linkText: data.section_1_link_text,
                linkUrl: data.section_1_link,
                backgroundImage: data.section_1_background_image.meta.download_url
            }
        }));
        this.regions.self.append(new OverlappingQuote({
            model: {
                quote: data.quote,
                name: data.quote_name,
                title: data.quote_title,
                school: data.quote_school
            }
        }));
        this.regions.self.append(new About({
            model: {
                heading: data.section_2_heading,
                description: data.section_2_description,
                image: data.section_2_image.meta.download_url,
                altText: data.section_2_image_alt
            }
        }));
        this.regions.self.append(new Promoting({
            model: {
                heading: data.section_3_heading,
                description: data.section_3_description,
                wideCards: data.section_3_wide_cards[0],
                tallCards: data.section_3_tall_cards[0].map(({html, link, link_text: linkText}) => (
                    {
                        html,
                        link,
                        linkText
                    }
                ))
            }
        }));
        this.regions.self.append(new BigQuote({
            model: {
                quote: data.section_4_quote_text,
                name: data.section_4_quote_name,
                title: data.section_4_quote_title,
                school: data.section_4_quote_school,
                backgroundImage: data.section_4_background_image.meta.download_url
            }
        }));
        this.regions.self.append(new Speaking({
            model: {
                heading: data.section_5_heading,
                description: data.section_5_description,
                image: data.section_5_image.meta.download_url,
                altText: data.section_5_image_alt,
                caption: data.section_5_image_caption
            }
        }));
        this.regions.self.append(new Results({
            model: {
                heading: data.section_6_heading,
                description: data.section_6_description,
                cards: data.section_6_cards[0].map((c, i) => ({
                    headingNumber: c.heading_number,
                    headingUnit: c.heading_unit,
                    description: c.description,
                    icon: {
                        image: i % 2 ? '/images/institutional-partner-program/second-result-icon.svg' :
                            '/images/institutional-partner-program/first-result-icon.svg'
                    }
                }))
            }
        }));
        this.regions.self.append(new Participants({
            model: {
                heading: data.section_7_heading,
                subheading: data.section_7_subheading,
                icons: data.section_7_icons[0].map((i) => ({
                    image: i.image.image,
                    altText: i.image_alt_text
                })),
                linkText: data.section_7_link_text,
                linkTarget: data.section_7_link_target
            }
        }));
        this.regions.self.append(new SmallQuote({
            model: {
                quote: data.section_8_quote_text,
                name: data.section_8_quote_name,
                title: data.section_8_quote_title,
                school: data.section_8_quote_school
            }
        }));
        this.regions.self.append(new SignUp({
            model: {
                heading: data.section_9_heading,
                submitUrl: data.section_9_submit_url,
                formPrompt: data.section_9_form_prompt,
                buttonText: data.section_9_button_text,
                contactHtml: data.section_9_contact_html
            }
        }));
    }

}
