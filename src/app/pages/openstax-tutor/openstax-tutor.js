import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import analytics from '~/helpers/analytics';
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
                text: 'Get Started',
                description: 'Preview and create a course.'
            },
            footerSignUp: {
                text: 'Join a Webinar',
                description: 'Get advice from pioneers of the tool.'
            },
            frontier: false,
            howItWorks: {
                blurbs: [
                    {
                        iconDescription: 'Spaced practice icon',
                        headline: 'Spaced practice',
                        description: 'Helps students remember what they previously learned',
                        imageUrl: '/images/openstax-tutor/spaced-practice.svg'
                    },
                    {
                        iconDescription: 'People icon',
                        headline: 'Personalized questions',
                        description: 'Help students learn where they need it most',
                        imageUrl: '/images/openstax-tutor/personalized.svg'
                    },
                    {
                        iconDescription: 'Feedback icon',
                        headline: 'Two-step questions',
                        description: 'Help students study more effectively',
                        imageUrl: '/images/openstax-tutor/two-step.svg'
                    },
                    {
                        iconDescription: '$10 icon',
                        headline: 'Low cost',
                        description: '$10 per course saves students money',
                        imageUrl: '/images/openstax-tutor/ten-dollar-bill.svg'
                    }
                ]
            },
            whatStudentsGet: {
                currentImage: null,
                images: [
                    {
                        url: '/images/openstax-tutor/1-dashboard/1-dashboard.png',
                        description: '<b>The dashboard</b> gives students an overview of ' +
                        'their assignments and progress.'
                    },
                    {
                        url: '/images/openstax-tutor/1-dashboard/2-clock.png',
                        description: 'A red clock icon shows which assignments were submitted late.'
                    },
                    {
                        url: '/images/openstax-tutor/1-dashboard/3-past-work.png',
                        description: 'Past due assignments are moved to the All Past Work tab.'
                    },
                    {
                        url: '/images/openstax-tutor/1-dashboard/4-browse.png',
                        description: 'Students can access their textbook content by clicking Browse the Book.'
                    },
                    {
                        url: '/images/openstax-tutor/1-dashboard/5-forecast.mp4',
                        description: 'The student performance forecast shows them how they’re doing overall.'
                    },
                    {
                        url: '/images/openstax-tutor/2-reading/1-physics.mp4',
                        description: 'Reading assignments present the textbook in manageable chunks.'
                    },
                    {
                        url: '/images/openstax-tutor/2-reading/2-bio.mp4',
                        description: 'Students will get three personalized questions per section you assign.'
                    },
                    {
                        url: '/images/openstax-tutor/2-reading/3-soci.mp4',
                        description: 'First, students are prompted to recall an answer from memory. ' +
                        'Multiple choice options follow.'
                    },
                    {
                        url: '/images/openstax-tutor/3-homework/1-physics.mp4',
                        description: 'Homework assignments include instructor-assigned questions, ' +
                        'and questions chosen by OpenStax Tutor Beta.'
                    },
                    {
                        url: '/images/openstax-tutor/3-homework/2-bio1.mp4',
                        description: 'First, OpenStax Tutor Beta prompts students to recall an answer from memory.'
                    },
                    {
                        url: '/images/openstax-tutor/3-homework/3-bio2.mp4',
                        description: 'After submitting an answer, students are given a multiple choice question.'
                    },
                    {
                        url: '/images/openstax-tutor/3-homework/4-soci.mp4',
                        description: 'Students get feedback right away, unless the instructor has ' +
                        'selected delayed feedback on the assignment.'
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
                    {amount: 1, description: 'Pays for our Support team'},
                    {amount: 1, description: 'Helps us keep the lights on'}
                ]
            },
            faq: {
                headline: 'Frequently asked questions'
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
                href: '#how-it-works-target',
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
            description: data.section_4_description ||
             '<p>Thousands of students have piloted OpenStax Tutor Beta. Here are the features ' +
             'we’ve prioritized, and more are on the way. Have suggestions for future development? ' +
             'Send us an email at <a href="mailto:info@openstaxtutor.org">info@openstaxtutor.org</a>.</p>',
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
        this.model.footerStarted.link = data.section_7_cta_link_1;
        this.model.footerSignUp.link = data.section_7_cta_link_2;

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
        this.onLoaded();

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

    onLoaded() {
        $.scrollToHash();
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
        const isVideo = (url) => (/.mp4/).test(url);
        const wsg = this.model.whatStudentsGet;

        wsg.transitioning = 'transitioning';
        this.update();

        setTimeout(() => {
            wsg.transitioning = '';
            wsg.currentImage = wsg.images[index];
            this.update();
            $.insertHtml(this.el.querySelector('#what-students-get'), this.model);
            const videoTag = this.el.querySelector('#what-students-get .viewer video');
            const thumbnailEl = this.el.querySelector('#what-students-get .thumbnails');
            const thumbnailWidth = thumbnailEl.scrollWidth;
            const thumbnailScrollDest = thumbnailWidth * index / wsg.images.length;

            const scrollStep = () => {
                const stepSize = 25;
                const currentPosition = thumbnailEl.scrollLeft;
                const direction = thumbnailScrollDest < currentPosition ? -1 : 1;
                const isLastStep = Math.abs(thumbnailScrollDest - currentPosition) < stepSize;
                const nextPosition = isLastStep ? thumbnailScrollDest : currentPosition + direction * stepSize;

                thumbnailEl.scrollLeft = nextPosition;

                if (!isLastStep && thumbnailEl.scrollLeft === nextPosition) {
                    window.requestAnimationFrame(scrollStep);
                }
            };

            window.requestAnimationFrame(scrollStep);

            // Delay play start
            if (isVideo(wsg.currentImage.url)) {
                setTimeout(() => {
                    videoTag.currentTime = 0;
                    videoTag.play();
                }, 400);
            }
        }, 400);
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        analytics.sendPageEvent(
            'OXT marketing page Learn more',
            'scroll',
            e.delegateTarget.href
        );
        $.hashClick(e);
    }

    @on('click a:not([href^="#"])')
    externalLinkClick(e) {
        const target = e.delegateTarget;
        const linkText = target.textContent;
        const footerEl = this.el.querySelector('.sticky-footer');
        const pageOrFooter = footerEl.contains(target) ? 'footer' : 'page';

        analytics.sendPageEvent(
            `OXT marketing page [${linkText}] ${pageOrFooter}`,
            'open',
            target.href
        );
    }

    @on('click .carousel .viewer [role="button"]')
    carouselArrowClick(e) {
        analytics.sendPageEvent(
            'OXT marketing page video carousel',
            'scroll',
            'video'
        );
    }

    @on('click .carousel .thumbnails > div')
    carouselThumbnailClick(e) {
        const clickedThumbnail = e.delegateTarget;
        const thumbnails = Array.from(this.el.querySelectorAll('.carousel .thumbnails > div'));
        const itemIndex = thumbnails.indexOf(clickedThumbnail);
        const blurb = $.htmlToText(this.model.whatStudentsGet.images[itemIndex].description);

        analytics.sendPageEvent(
            `OXT marketing button [${blurb}]`,
            'open',
            'video'
        );
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
