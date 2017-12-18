import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import SectionNavigator from './section-navigator/section-navigator';
import PulsingDot from './pulsing-dot/pulsing-dot';
import {on} from '~/helpers/controller/decorators';
import analytics from '~/helpers/analytics';
import {description as template} from './openstax-tutor.html';
import 'particles.js/particles';
import particleConfig from './particlesjs-config';
import {debounce} from 'lodash';

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
            frontier: false,
            howItWorks: {},
            whatStudentsGet: {
                currentImage: null,
                images: [
                ]

            },
            featureMatrix: {},
            comingSoon: {},
            whereMoneyGoes: {},
            science: {},
            faq: {},
            learnMore: {}
        };
        this.slug = 'pages/tutor-marketing';
        this.regions = {
            floatingTools: '.floating-tools'
        };
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
        this.model.access = {
            text: data.access_tagline,
            label: data.access_button_cta,
            url: data.access_button_link
        };
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
            description: data.section_2_paragraph,
            blurbs: [1, 2, 3, 4].map((num) => (
                {
                    headline: data[`icon_${num}_subheading`],
                    iconDescription: `${data[`icon_${num}_subheading`]} icon`,
                    description: data[`icon_${num}_paragraph`],
                    imageUrl: data[`icon_${num}_image_url`]
                }
            ))
        });
        Object.assign(this.model.whatStudentsGet, {
            headline: data.section_3_heading,
            description: data.section_3_paragraph,
            images: data.marketing_videos.map((entry) => ({
                url: entry.video_url || entry.video_file || entry.image_url || entry.image,
                description: entry.video_image_blurb
            }))
        });
        this.model.whatStudentsGet.currentImage = this.model.whatStudentsGet.images[0];

        Object.assign(this.model.featureMatrix, {
            headline: data.section_4_heading,
            description: data.section_4_paragraph ||
             '<p>XX THIS TEXT NEEDS TO BE ENTERED INTO THE CMS XX</p>',
            availability: data.section_4_book_heading,
            availableBooks: data.marketing_books.map((b) => ({
                description: b.title,
                url: b.cover_url
            })),
            resourceFinePrint: data.section_4_resource_fine_print
        });
        Object.assign(this.model.comingSoon, {
            headline: data.section_4_coming_soon_heading,
            description: data.section_4_coming_soon_text
        });
        Object.assign(this.model.whereMoneyGoes, {
            headline: data.section_5_heading,
            description: data.section_5_paragraph
        });
        Object.assign(this.model.science, {
            headline: data.section_5_science_heading,
            description: data.section_5_science_paragraph
        });
        Object.assign(this.model.faq, {
            headline: data.section_6_heading,
            items: data.faqs,
            knowledgeBaseCopy: data.section_6_knowledge_base_copy
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

        this.model.footerStarted = {
            text: data.floating_footer_button_1_cta,
            description: data.floating_footer_button_1_caption,
            link: data.floating_footer_button_1_link
        };
        this.model.footerSignUp = {
            text: data.floating_footer_button_2_cta,
            description: data.floating_footer_button_2_caption,
            link: data.floating_footer_button_2_link
        };

        this.model.featureMatrix.features = data.resource_availability;

        this.update();
        $.insertHtml(this.el, this.model);
        this.onLoaded();

        let lastYOffset = 0;

        this.handleScroll = debounce((event) => {
            const newYOffset = window.pageYOffset;
            const distanceFromBottom = document.body.offsetHeight - window.innerHeight - newYOffset;

            this.model.footerHeight =
                (newYOffset < 100) || (distanceFromBottom < 100) ? 'collapsed' : '';
            this.update();
            lastYOffset = newYOffset;
        }, 80);

        window.addEventListener('scroll', this.handleScroll);
        const pageFooter = document.querySelector('.page-footer');
        const mainSection = document.getElementById('main');

        if (pageFooter) {
            pageFooter.classList.add('openstax-tutor-footer');
        }
        if (mainSection) {
            mainSection.classList.add('openstax-tutor-main');
        }
    }

    onLoaded() {
        if (this.model.frontier) {
            $.scrollToHash();
            const sectionIds = Array.from(this.el.querySelectorAll('section[id]'))
                .map((el) => el.id);
            const sectionNavigator = new SectionNavigator(sectionIds);
            const pulsingDot = new PulsingDot();


            this.regions.floatingTools.attach(sectionNavigator);
            this.regions.floatingTools.append(pulsingDot);

            if (document.getElementById('particles')) {
                window.particlesJS('particles', particleConfig);
            }
        }
    }

    onClose() {
        window.removeEventListener('scroll', this.handleScroll);
        document.querySelector('.page-footer').classList.add('openstax-tutor-footer');
        document.getElementById('main').classList.remove('openstax-tutor-main');
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

    @on('click .activate-popup')
    activatePopup(event) {
        const headlineEl = document.querySelector('#new-frontier .headline');
        const popupEl = document.querySelector('.popup-text');

        headlineEl.classList.add('expanded');
        popupEl.classList.remove('hidden');
        event.target.classList.add('hidden');
        event.preventDefault();
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
        this.setCurrentImage(itemIndex);
        e.preventDefault();
    }

}
