import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './openstax-tutor.html';

const availableUrl = '/images/openstax-tutor/available-flag.svg';
const unavailableUrl = '/images/openstax-tutor/unavailable-flag.svg';
const availableImageData = {url: availableUrl, description: 'available'};
const unavailableImageData = {url: unavailableUrl, description: 'not available'};

export default class Tutor extends CMSPageController {

    static description = 'OpenStax Tutor Beta is a personalized learning tool ' +
        'that improves how students learn with research-based technology, for only $10.';

    init() {
        this.template = template;
        this.view = {
            classes: ['openstax-tutor-page', 'page']
        };
        this.css = '/app/pages/openstax-tutor/openstax-tutor.css';
        this.model = {
            footerStarted: {
                url: '#',
                text: 'Get Started',
                description: 'Try OpenStax Tutor today.'
            },
            footerSignUp: {
                url: '#',
                text: 'Sign Up',
                description: 'Join an OpenStax Tutor webinar to answer all your questions'
            },
            frontier: false,
            howItWorks: {
                blurbs: [
                    {
                        iconDescription: 'Learning icon',
                        headline: 'Personalized learning',
                        description: 'based on each student’s understanding of the text',
                        imageUrl: '/images/openstax-tutor/personalized.svg'
                    },
                    {
                        iconDescription: 'Feedback icon',
                        headline: 'Algorithms provide feedback',
                        description: 'meaning the student gets the right help, right now',
                        imageUrl: '/images/openstax-tutor/two-step.svg'
                    },
                    {
                        iconDescription: 'People icon',
                        headline: 'Personalized questions',
                        description: 'focus on the topics each student needs the most help with',
                        imageUrl: '/images/openstax-tutor/personalized.svg'
                    },
                    {
                        iconDescription: '$10 icon',
                        headline: '$10',
                        description: 'per student per semester. Yes, really.',
                        imageUrl: '/images/openstax-tutor/ten-dollar-bill.svg'
                    }
                ]
            },
            whatStudentsGet: {
                currentImage: null,
                images: [
                    {
                        description: 'first image',
                        url: '/images/openstax-tutor/1-dashboard/1-dashboard.png',
                        caption: 'some text below'
                    },
                    {
                        description: 'second image',
                        url: '/images/openstax-tutor/1-dashboard/2-clock.png',
                        caption: 'some text below'
                    },
                    {
                        description: 'third image',
                        url: '/images/openstax-tutor/1-dashboard/3-past-work.png',
                        caption: 'some text below'
                    },
                    {
                        description: 'fourth image',
                        url: '/images/openstax-tutor/1-dashboard/4-browse.png',
                        caption: 'some text below'
                    },
                    {
                        description: 'fifth image',
                        url: '/images/openstax-tutor/1-dashboard/5-forecast.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'sixth image',
                        url: '/images/openstax-tutor/2-reading/1-physics.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'seventh image',
                        url: '/images/openstax-tutor/2-reading/2-bio.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'eighth image',
                        url: '/images/openstax-tutor/2-reading/3-soci.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'ninth image',
                        url: '/images/openstax-tutor/3-homework/1-physics.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'tenth image',
                        url: '/images/openstax-tutor/3-homework/2-bio1.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'eleventh image',
                        url: '/images/openstax-tutor/3-homework/3-bio2.mp4',
                        caption: 'some text below'
                    },
                    {
                        description: 'twelfth image',
                        url: '/images/openstax-tutor/3-homework/4-soci.mp4',
                        caption: 'some text below'
                    }
                ]

            },
            featureMatrix: {
                availableIcon: availableUrl,
                unavailableIcon: unavailableUrl,
                featurePairs: [],
                availableBooks: [
                    {description: 'College Physics cover', url: '#'},
                    {description: 'Biology cover', url: '#'},
                    {description: 'Sociology 2e cover', url: '#'}
                ]
            },
            whereMoneyGoes: {
                items: [
                    {amount: 5, description: 'Pays for our engineers and researchers'},
                    {amount: 3, description: 'Pays for authors to keep content current'},
                    {amount: 1, description: 'Pays for our customer service posse'},
                    {amount: 1, description: 'Pays for, well, this'}
                ]
            },
            faq: {
                headline: 'Ask your questions now, you won’t have any later! '
            },
            learnMore: {
                buttons: []
            }
        };
        this.slug = 'pages/tutor-marketing';
    }

    onDataError(e) {
        console.warn(e);
    }

    onDataLoaded() {
        const data = this.pageData;

        document.title = `${data.title} - OpenStax`;
        Object.assign(this.model, data);
        this.model.footerHeight = 'collapsed';
        this.update();
        this.model.frontier = {
            headline: data.section_1_heading,
            subhead: data.section_1_subheading,
            description: data.section_1_paragraph,
            learnMore: {
                href: data.section_1_cta_link,
                text: data.section_1_cta_text
            }
        };
        Object.assign(this.model.howItWorks, {
            headline: data.section_2_heading,
            subhead: data.section_2_subheading,
            description: data.section_2_paragraph
        });
        Object.assign(this.model.whatStudentsGet, {
            headline: data.section_3_heading,
            description: data.section_3_paragraph,
            currentImage: this.model.whatStudentsGet.images[0]
        });
        Object.assign(this.model.featureMatrix, {
            headline: data.section_4_heading,
            availability: data.section_4_book_heading,
            availableBooks: data.marketing_books.map((b) => ({
                description: b.title,
                url: b.cover_url
            }))
        });
        Object.assign(this.model.whereMoneyGoes, {
            headline: data.section_5_heading,
            description: data.section_5_paragraph
        });
        Object.assign(this.model.faq, {
            items: data.faqs
        });
        Object.assign(this.model.learnMore, {
            headline: data.section_7_heading,
            subhead: data.section_7_subheading,
            buttons: [
                {
                    text: data.section_7_cta_text_1,
                    description: data.section_7_cta_blurb_1,
                    url: data.section_7_cta_link_1
                },
                {
                    text: data.section_7_cta_text_2,
                    description: data.section_7_cta_blurb_2,
                    url: data.section_7_cta_link_2
                }
            ].filter((obj) => obj.text) // only keep the ones with text values
        });

        this.model.featureMatrix.featurePairs = data.resource_availability
        .map((obj) => ({
            text: obj.name,
            image: obj.available ? availableImageData : unavailableImageData,
            value: obj.alternate_text
        }))
        .reduce((result, value, index, arr) => {
            if (index % 2 === 0) {
                const newPair = arr.slice(index, index + 2);

                if (newPair.length < 2) {
                    newPair.push({});
                }
                result.push(newPair);
            }
            return result;
        }, []);

        this.update();
        $.insertHtml(this.el, this.model);

        let lastYOffset = 0;

        this.handleScroll = (event) => {
            const newYOffset = window.pageYOffset;

            if (lastYOffset < 100 && newYOffset >= 100) {
                this.model.footerHeight = null;
                this.update();
            }
            if (lastYOffset >= 100 && newYOffset < 100) {
                this.model.footerHeight = 'collapsed';
                this.update();
            }
            lastYOffset = newYOffset;
        };

        window.addEventListener('scroll', this.handleScroll);
    }

    onClose() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    @on('click .toggled-item[aria-role="button"]')
    toggleItem(event) {
        const index = event.delegateTarget.dataset.index;
        const item = this.model.faq.items[index];

        item.isOpen = !item.isOpen;
        this.update();
    }

    setCurrentImage(index) {
        const videoTag = this.el.querySelector('#what-students-get video');
        const wsg = this.model.whatStudentsGet;

        wsg.currentImage = wsg.images[index];
        this.update();
        // Updating the source element in the HTML is not intended to work!
        if (videoTag) {
            videoTag.src = wsg.currentImage.url;
        }
    }

    @on('click .viewer [role="button"][data-decrement]')
    decrementVideoIndex() {
        const wsg = this.model.whatStudentsGet;
        const childNumber = wsg.images.indexOf(wsg.currentImage);

        if (childNumber > 0) {
            this.setCurrentImage(childNumber - 1);
        }
    }

    @on('click .viewer [role="button"][data-increment]')
    incrementVideoIndex() {
        const wsg = this.model.whatStudentsGet;
        const childNumber = wsg.images.indexOf(wsg.currentImage);

        if (childNumber < wsg.images.length - 1) {
            this.setCurrentImage(childNumber + 1);
        }
    }

    @on('click .thumbnails > div')
    setCurrentImageByClick(e) {
        const target = e.delegateTarget;
        const childNumber = Array.from(target.parentNode.children).indexOf(target);

        this.setCurrentImage(childNumber);
        e.preventDefault();
    }

}
