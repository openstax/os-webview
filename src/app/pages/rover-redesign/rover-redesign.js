import componentType, {canonicalLinkMixin, flattenPageDataMixin} from '~/helpers/controller/init-mixin';
import css from './rover-redesign.css';
import bannerSection from './sections/banner';
import videoSection from './sections/video';
import meetRoverSection from './sections/meet-rover';
import stepwiseSection from './sections/stepwise';
import gettingStartedSection from './sections/getting-started';
import lmsSection from './sections/lms';
import faqSection from './sections/faq';
import StickyFooter from '~/components/sticky-footer/sticky-footer';
import SectionNavigator from '~/components/section-navigator/section-navigator';

const spec = {
    css,
    view: {
        classes: ['rover-redesign', 'page'],
        tag: 'main'
    },
    slug: 'pages/rover-2',
    model() {
        return {
        };
    },
    preserveWrapping: true
};
const BaseClass = componentType(spec, canonicalLinkMixin, flattenPageDataMixin);

export default class RoverRedesign extends BaseClass {

    onDataLoaded() {
        const data = this.flattenPageData();
        const floatingTools = new (componentType({
            view: {
                classes: ['floating-tools']
            }
        }))();

        const sections = [
            bannerSection({
                model: {
                    headerImage: data.header_image || '/images/rover-redesign/rover-logo.png',
                    mobileHeaderImage: data.mobile_header_image || '/images/rover-by-openstax/logo-mobile.png',
                    headerImageAltText: 'Rover logo',
                    accessLink: data.section_1.accessButtonLink,
                    accessText: data.section_1.accessButtonCta,
                    headline: 'Rover by OpenStax',
                    introHtml: data.section_1.blurb,
                    button1Url: data.section_1.buttonLink,
                    button1Text: data.section_1.buttonCta
                }
            }),
            videoSection({
                model: {
                    heading: data.section_2.heading,
                    subhead: data.section_2.subheading,
                    description: data.section_2.blurb,
                    video: data.section_2.video
                }
            }),
            meetRoverSection({
                model: {
                    heading: data.section_3.heading,
                    description: data.section_3.subheading,
                    cards: data.section_3.cards.map((c) => ({
                        image: c.icon.file,
                        imageAltText: 'need some alt text',
                        description: c.blurb
                    })),
                    webinarLink: '/need-a-link',
                    webinarLinkText: data.section_3.buttonCta
                }
            }),
            stepwiseSection({
                model: {
                    heading: data.section_4.heading,
                    description: data.section_4.blurb,
                    cards: data.section_4.cards.map((c) => ({
                        heading: c.heading,
                        description: c.blurb,
                        image: {
                            image: c.image.file,
                            imageAltText: 'need alt text'
                        }
                    }))
                }
            }),
            lmsSection({
                model: {
                    heading: data.section_6.heading,
                    description: data.section_6.blurb,
                    image: {
                        image: data.section_6.image.file,
                        altText: data.section_6.imageAltText
                    },
                    caption: data.section_6.caption
                }
            }),
            gettingStartedSection({
                model: {
                    heading: data.section_5.heading,
                    description: data.section_5.blurb,
                    cards: data.section_5.cards.map((c) => ({
                        heading: c.heading,
                        description: c.blurb,
                        video: c.video
                    }))
                }
            }),
            faqSection({
                model: {
                    heading: 'Frequently Asked Questions',
                    questions: data.section_7.faqs
                }
            }),
            new StickyFooter({
                leftButton: {
                    link: data.section_7.webinarButtonUrl,
                    text: data.section_7.webinarButtonCta,
                    description: ''
                },
                rightButton: {
                    link: data.section_7.signupButtonUrl,
                    text: data.section_7.signupButtonCta,
                    description: ''
                }
            }),
            floatingTools
        ];

        sections.forEach((section) => {
            this.regions.self.append(section);
        });
        const sectionIds = Array.from(this.el.querySelectorAll('section[id]'))
            .map((el) => el.id);
        const sectionNavigator = new SectionNavigator(sectionIds);

        floatingTools.regions.self.attach(sectionNavigator);
    }

}
