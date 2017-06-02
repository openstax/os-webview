import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './openstax-tutor.html';

export default class Tutor extends CMSPageController {

    // TODO Update description
    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        this.template = template;
        this.view = {
            classes: ['openstax-tutor-page', 'page']
        };
        this.css = '/app/pages/openstax-tutor/openstax-tutor.css';
        this.model = {
            frontier: false,
            howItWorks: {
                blurbs: [
                    {
                        iconDescription: 'Learning icon',
                        headline: 'Personalized learning',
                        description: 'based on each student’s understanding of the text'
                    },
                    {
                        iconDescription: 'Feedback icon',
                        headline: 'Algorithms provide feedback',
                        description: 'meaning the student gets the right help, right now'
                    },
                    {
                        iconDescription: 'People icon',
                        headline: 'Personalized questions',
                        description: 'focus on the topics each student needs the most help with'
                    },
                    {
                        iconDescription: '$10 icon',
                        headline: '$10',
                        description: 'per student per semester. Yes, really.'
                    }
                ]
            },
            whatStudentsGet: {
                currentImageDescription: 'some image description',
                currentImageCaption: 'Learning algorithms show where students struggle, then' +
                ' refocus efforts accordingly',
                images: [
                    {description: 'first image', url: '#', caption: 'some text below'},
                    {description: 'second image', url: '#', caption: 'some text below 2'},
                    {description: 'third image', url: '#', caption: 'some text below 3'},
                    {description: 'fourth image', url: '#', caption: 'some text below 4'}
                ]

            },
            featureMatrix: {
                featurePairs: [
                    [{text: 'Integrated digital textbook', image: {url: '#', description: 'foo'}},
                     {text: 'Student Performance Forecast', image: {url: '#', description: 'foo'}}],
                    [{text: 'Video', image: {url: '#', description: 'foo'}},
                     {text: 'Full LMS Integration', value: 'Nope but we may have this in the future'}],
                    [{text: 'Integrated digital textbook', image: {url: '#', description: 'foo'}},
                     {text: 'Integrated digital textbook', image: {url: '#', description: 'foo'}}],
                    [{text: 'Integrated digital textbook', image: {url: '#', description: 'foo'}},
                     {text: 'Integrated digital textbook', image: {url: '#', description: 'foo'}}],
                    [{text: 'Should have key next', image: {url: '#', description: 'foo'}},
                     {}]
                ],
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

    onDataLoaded() {
        const data = this.pageData;

        document.title = `${data.title} - OpenStax`;
        Object.assign(this.model, data);
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
            description: data.section_3_paragraph
        });
        Object.assign(this.model.featureMatrix, {
            headline: data.section_4_heading,
            availability: data.section_4_book_heading
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

        this.update();
        $.insertHtml(this.el, this.model);
    }

    @on('click .toggled-item[aria-role="button"]')
    toggleItem(event) {
        const index = event.delegateTarget.dataset.index;
        const item = this.model.faq.items[index];

        item.isOpen = !item.isOpen;
        this.update();
    }

}
