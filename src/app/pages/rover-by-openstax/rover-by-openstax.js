import componentType, {canonicalLinkMixin, flattenPageDataMixin, loaderMixin} from '~/helpers/controller/init-mixin';
import css from './rover-by-openstax.css';
import Navigator from './navigator/navigator';
import Banner from './banner/banner';
import MeetRover from './meet-rover/meet-rover';
import Stepwise from './stepwise/stepwise';
import LMS from './lms/lms';
import GettingStarted from './getting-started/getting-started';
import OfficeHours from './office-hours/office-hours';
import FAQ from './faq/faq';
import PopupContent from './popup/popup';
import ModalContent from '~/components/modal-content/modal-content';
import {on} from '~/helpers/controller/decorators';

const spec = {
    css,
    view: {
        classes: ['rover-by-openstax', 'page'],
        tag: 'main'
    },
    slug: 'pages/rover-2',
    model() {
        return {
        };
    },
    preserveWrapping: true
};

const BaseClass = componentType(spec, canonicalLinkMixin, flattenPageDataMixin, loaderMixin);

export default class RoverRedesign extends BaseClass {

    onDataLoaded() {
        const data = this.flattenPageData();
        const headerImage = '/images/rover-by-openstax/rover-logo-orange.svg';
        const sections = [
            new Banner({
                model: {
                    headerImage,
                    mobileHeaderImage: headerImage,
                    headerImageAltText: 'Rover logo',
                    accessLink: 'transition-popup',
                    accessText: data.section_1.accessButtonCta,
                    headline: 'Rover by OpenStax',
                    introHtml: data.section_1.blurb,
                    button1Url: data.section_1.buttonLink,
                    button1Text: data.section_1.buttonCta,
                    video: data.section_2.video

                }
            }),
            new MeetRover({
                model: {
                    heading: data.section_3.heading,
                    linkText: data.section_3.navText,
                    description: data.section_3.subheading,
                    cards: data.section_3.cards.map((c) => ({
                        image: c.icon.file,
                        description: c.blurb
                    })),
                    webinarLink: data.section_3.buttonLink,
                    webinarLinkText: data.section_3.buttonCta
                }
            }),
            new Stepwise({
                model: {
                    heading: data.section_4.heading,
                    linkText: data.section_4.navText,
                    description: data.section_4.blurb,
                    cards: data.section_4.cards.map((c) => ({
                        heading: c.heading,
                        description: c.blurb,
                        image: {
                            image: c.image.file,
                            imageAltText: c.imageAltText
                        }
                    }))
                }
            }),
            new LMS({
                model: {
                    heading: data.section_6.heading,
                    linkText: data.section_6.navText,
                    description: data.section_6.blurb,
                    image: {
                        image: data.section_6.image.file,
                        altText: data.section_6.imageAltText
                    },
                    caption: data.section_6.caption
                }
            }),
            new GettingStarted({
                model: {
                    heading: data.section_5.heading,
                    linkText: data.section_5.navText,
                    description: data.section_5.blurb,
                    cards: data.section_5.cards.map((c) => ({
                        heading: c.heading,
                        description: c.blurb,
                        video: c.video
                    }))
                }
            }),
            new OfficeHours({
                model: {
                    heading: 'Office Hours',
                    description: `Interested in learning more about Rover by OpenStax?
                    Have questions and want to speak to a real person? Join us for
                    Rover Office Hours! We host a weekly interactive Q&A session on
                    Thursdays from 2 - 3 p.m. (CST). We will answer any questions
                    you have about Rover, including how to set up your course, create
                    assignments, and more. Click on the link below to sign up.`,
                    moreInfo: `Can't make it? To schedule a one-on-one meeting, email
                    us at <a href="mailto:communications@openstax.org">communications@openstax.org</a>`,
                    image: {
                        image: '/images/rover-by-openstax/office-hours.svg',
                        altText: ''
                    },
                    linkUrl: '/sign-up',
                    linkText: 'Sign up for office hours'
                }
            }),
            new FAQ({
                model: {
                    heading: 'Frequently Asked Questions',
                    linkText: data.section_7.navText,
                    questions: data.section_7.faqs
                }
            })
        ];
        const navModel = sections
            .filter((s) => s.model && s.model.linkText)
            .map((s) => ({
                id: s.el.id,
                heading: s.model.linkText
            }));

        navModel.heading = this.pageData.nav_title;
        const nav = new Navigator({
            model: navModel
        });

        sections.splice(1, 0, nav);
        this.hideLoader();
        sections.forEach((section) => {
            this.regions.self.append(section);
        });
        const cmsPopupData = data.popup.content[0];

        this.popupData = Object.assign(
            {
                loginUrl: data.section_1.accessButtonLink
            },
            cmsPopupData
        );
    }

    @on('click a[href="transition-popup"]')
    showPopup(event) {
        event.preventDefault();
        const popupContent = new PopupContent({
            model: this.popupData
        });
        const modalContent = new ModalContent({
            content: popupContent
        });

        this.regions.self.append(modalContent);
        popupContent.on('cancel', () => {
            const mcEl = modalContent.el;
            const mcIdx = this.regions.self.controllers.indexOf(modalContent);

            modalContent.detach();
            // Necessary due to a bug in superb
            mcEl.parentNode.removeChild(mcEl);
            this.regions.self.controllers.splice(mcIdx, 1);
        });
    }

}
