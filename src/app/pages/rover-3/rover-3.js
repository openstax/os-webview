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

const spec = {
    css,
    view: {
        classes: ['rover-by-openstax', 'page'],
        tag: 'main'
    },
    // TEMPORARY
    // slug: 'pages/rover-2',
    model() {
        return {
        };
    },
    preserveWrapping: true
};

const BaseClass = componentType(spec, canonicalLinkMixin, flattenPageDataMixin, loaderMixin);

export default class RoverRedesign extends BaseClass {

    // TEMPORARY
    onLoaded() {
        /* eslint-disable */
        this.pageData = {
            "id": 285,
            "meta": {
                "slug": "rover-2",
                "seo_title": "",
                "search_description": "",
                "type": "pages.RoverPage",
                "detail_url": "https://cms-dev.openstax.org/apps/cms/api/v2/pages/285/",
                "html_url": "http://cms-dev.openstax.org/rover-2/",
                "show_in_menus": false,
                "first_published_at": "2019-01-14T10:36:28.179000-06:00",
                "parent": {
                    "id": 29,
                    "meta": {
                        "type": "pages.HomePage",
                        "detail_url": "https://cms-dev.openstax.org/apps/cms/api/v2/pages/29/",
                        "html_url": "http://cms-dev.openstax.org/"
                    },
                    "title": "Openstax Homepage"
                }
            },
            "title": "Rover (phase 2)",
            "nav_title": "On this page",
            "section_1": [
                {
                    "value": {
                        "id": 591,
                        "file": "/images/rover-3/rover-logo-orange.svg",
                        "title": "Rover logo",
                        "height": 524,
                        "width": 1890,
                        "created_at": "2019-02-01T12:13:14.577906-06:00"
                    },
                    "id": "ddc5d953-03ea-4dab-8b62-e8a1c3fbfa84",
                    "type": "image"
                },
                {
                    "value": "https://tutor.openstax.org",
                    "id": "aafee38f-d44c-4926-b0b9-101a7c2ced41",
                    "type": "access_button_link"
                },
                {
                    "value": "Access your course",
                    "id": "71aebc3b-7499-4c9f-a5da-bd61424cc592",
                    "type": "access_button_cta"
                },
                {
                    "value": "Affordable online math homework with step-level feedback to support your students and detailed analytics to support your teaching. <b>Only $22 per course.</b>",
                    "id": "59b01255-19a6-402a-a76c-5fdcc531e479",
                    "type": "blurb"
                },
                {
                    "value": "https://openstax.org/rover-by-openstax#meet-rover",
                    "id": "cb78aa5c-2b1b-4e1d-866d-1375bfc000b5",
                    "type": "button_link"
                },
                {
                    "value": "Learn more",
                    "id": "c5fab5a1-bc0c-44c1-bd84-a9e6d5279538",
                    "type": "button_cta"
                }
            ],
            "section_2": [
                {
                    "value": "Video",
                    "id": "4a628014-208a-4b7d-b251-8068a50037a6",
                    "type": "heading"
                },
                {
                    "value": "Video",
                    "id": "900b8ce4-2b6c-4902-8927-7783741f19d8",
                    "type": "nav_text"
                },
                {
                    "value": "Lorem ipsum dolor sit",
                    "id": "bf745e15-782b-46c8-9f3d-7df3ddc324e7",
                    "type": "subheading"
                },
                {
                    "value": "This is the plain text section, but it can include some HTML markup like <b>bold text</b> or even <a href=\"http://openstax.org\">a link</a>.",
                    "id": "7e7de316-5e01-4936-a8c2-94800ddbb4d3",
                    "type": "blurb"
                },
                {
                    "value": "<iframe src=\"https://www.youtube.com/embed/-AdiosVtq84\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>",
                    "id": "b175d37e-3e84-42fd-a362-796a7a2ae62a",
                    "type": "video"
                }
            ],
            "section_3": [
                {
                    "value": "Meet Rover",
                    "id": "2bd3e564-7a4e-4cef-9db5-473dba4afeba",
                    "type": "heading"
                },
                {
                    "value": "Meet Rover",
                    "id": "cf25e169-213f-4af8-8998-e4dab074a4a0",
                    "type": "nav_text"
                },
                {
                    "value": "Guiding your students to better learning for just $22.",
                    "id": "00295d35-743a-4a94-9d01-962d55024449",
                    "type": "subheading"
                },
                {
                    "value": [
                        {
                            "blurb": "Detailed analytics help you target where students need help",
                            "icon": {
                                "id": 578,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.32.54_PM.png",
                                "title": "Yellow icon",
                                "height": 176,
                                "width": 214,
                                "created_at": "2019-01-25T14:34:25.848044-06:00"
                            }
                        },
                        {
                            "blurb": "Grades work so you don't have to",
                            "icon": {
                                "id": 579,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.33.04_PM.png",
                                "title": "Blue icon",
                                "height": 180,
                                "width": 258,
                                "created_at": "2019-01-25T14:34:41.004371-06:00"
                            }
                        },
                        {
                            "blurb": "You deserve how to award credit",
                            "icon": {
                                "id": 580,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.33.14_PM.png",
                                "title": "Pink icon",
                                "height": 180,
                                "width": 230,
                                "created_at": "2019-01-25T14:34:54.394779-06:00"
                            }
                        },
                        {
                            "blurb": "Never pay twice: students retake the course for free",
                            "icon": {
                                "id": 581,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.33.25_PM.png",
                                "title": "Green icon",
                                "height": 194,
                                "width": 262,
                                "created_at": "2019-01-25T14:35:10.716563-06:00"
                            }
                        },
                        {
                            "blurb": "<b> Rover show me </b> analyzes and grades unique problem-solving steps",
                            "icon": {
                                "id": 582,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.33.33_PM.png",
                                "title": "Purple Icon",
                                "height": 198,
                                "width": 252,
                                "created_at": "2019-01-25T14:36:04.161251-06:00"
                            }
                        },
                        {
                            "blurb": "<b> Rover Retrieve </b> brings students instant feedback and help",
                            "icon": {
                                "id": 583,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/Screen_Shot_2019-01-25_at_2.33.40_PM.png",
                                "title": "Orange icon",
                                "height": 192,
                                "width": 278,
                                "created_at": "2019-01-25T14:36:19.052172-06:00"
                            }
                        }
                    ],
                    "id": "deea0def-5bb9-4800-b562-0c82fa6b30f1",
                    "type": "cards"
                },
                {
                    "value": "Join a webinar",
                    "id": "d50de959-7c13-4e33-ba1e-90cc1d481fdd",
                    "type": "button_cta"
                },
                {
                    "value": "https://openstax.org",
                    "id": "4520f1b4-c5ce-4557-854c-29f835164513",
                    "type": "button_link"
                }
            ],
            "section_4": [
                {
                    "value": "The Power of StepWise",
                    "id": "fa697815-1193-4be8-b363-96b93565cbf8",
                    "type": "heading"
                },
                {
                    "value": "StepWise®",
                    "id": "1ebae2f0-d065-4321-ba51-97616246e76f",
                    "type": "nav_text"
                },
                {
                    "value": "There are often multiple paths to the correct answer, so StepWise® dynamically evaluates each step the student enters to see if it lies on a mathematically valid path to the solution, then gives hints and feedback specific to the student's approach.",
                    "id": "adb6f5ea-1610-49ba-b183-94891153a4b5",
                    "type": "blurb"
                },
                {
                    "value": [
                        {
                            "heading": "Rover Show Me",
                            "blurb": "allows students to show their work in the way that makes the most sense to them - as long as the steps are valid, the question will be market correct.",
                            "image": {
                                "id": 588,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/rover-show-me.gif",
                                "title": "Rover Show Me",
                                "height": 641,
                                "width": 1076,
                                "created_at": "2019-01-30T14:14:42.583605-06:00"
                            },
                            "image_alt_text": "rover show me"
                        },
                        {
                            "heading": "Rover Retrieve",
                            "blurb": "analyzes the student's errors and brings back instant feedback and guidance.",
                            "image": {
                                "id": 589,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/rover-retrieve.gif",
                                "title": "Rover Retrieve",
                                "height": 642,
                                "width": 1074,
                                "created_at": "2019-01-30T14:15:12.414628-06:00"
                            },
                            "image_alt_text": "guy w robot"
                        }
                    ],
                    "id": "75a61599-4694-4fe6-8a6a-57fc68e8cb37",
                    "type": "cards"
                }
            ],
            "section_5": [
                {
                    "value": "Getting started with Rover",
                    "id": "4da6ebd7-840b-4ad8-9051-e8180df3fb79",
                    "type": "heading"
                },
                {
                    "value": "Getting started",
                    "id": "73063e63-e3dc-4b7b-93b5-6b3d60340688",
                    "type": "nav_text"
                },
                {
                    "value": "We have a library of getting started videos to help instructors and students get to know Rover.",
                    "id": "62e28048-431b-4a83-bc2f-cd668a0e466d",
                    "type": "blurb"
                },
                {
                    "value": [
                        {
                            "heading": "Editable question bank",
                            "video": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/-AdiosVtq84\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>",
                            "blurb": "All of the questions from the book are built into the system. Keep the ones you like, get rid of the ones you don't."
                        },
                        {
                            "heading": "Aligned with the book",
                            "video": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/-AdiosVtq84\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>",
                            "blurb": "Rover is built to complement our Algebra and Trigonometry, Precalculus, and College Algebra books, making it simple to adapt your course."
                        }
                    ],
                    "id": "bc06a22d-de75-44dd-ac10-3f44bf2c13da",
                    "type": "cards"
                }
            ],
            "section_6": [
                {
                    "value": "Rover in your LMS",
                    "id": "44eee10e-dbb1-4302-805a-ab78795dfda6",
                    "type": "heading"
                },
                {
                    "value": "Rover in your LMS",
                    "id": "538adbfb-1c31-4f9b-b77a-cd634f1a7d9a",
                    "type": "nav_text"
                },
                {
                    "value": "<p>Rover utilizes Willo Labs to make your LMS or portal integration easy, fast, and manageable.<br/><br/> Rover&#x27;s integration with Willo Labs</p>",
                    "id": "50d165b6-24bb-44f1-880d-e9c0afb111d1",
                    "type": "blurb"
                },
                {
                    "value": {
                        "id": 590,
                        "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/rover-lms-img2x.png",
                        "title": "Rover in your LMS 2x",
                        "height": 1190,
                        "width": 1826,
                        "created_at": "2019-01-30T14:18:25.365645-06:00"
                    },
                    "id": "b5dacf6a-8e26-4ae1-8816-600f2818ce01",
                    "type": "image"
                },
                {
                    "value": "blackboard graphic",
                    "id": "188134a0-2698-4244-872b-f88f46e75a43",
                    "type": "image_alt_text"
                },
                {
                    "value": "Use a different LMS? Let us know so we can consider it for future development.",
                    "id": "3ce06887-90de-49db-8a29-49de62c07cf3",
                    "type": "caption"
                }
            ],
            "section_7": [
                {
                    "value": "FAQ",
                    "id": "02e34c78-2abc-4fe4-a45f-1ba0db1e4d27",
                    "type": "nav_text"
                },
                {
                    "value": [
                        {
                            "question": "Can students use financial aid to pay for Rover?",
                            "answer": "If your student can afford Rover, but does not have access to a credit or debit card to do so, they can pay for Rover through their school’s inclusive access program. There will be more information available in January about payment through inclusive access programs. <i>If your student cannot afford Rover, please contact us.</i>"
                        },
                        {
                            "question": "Can students register directly through their learning management system (e.g. Canvas)?",
                            "answer": "Students first register at [Rover url], then they can access Rover directly through Canvas, Blackboard, D2L Brightspace, and Moodle."
                        },
                        {
                            "question": "Can students takes tests directly in Rover?",
                            "answer": "Rover was designed for homework assignments. Using it as a testing tool is not recommended."
                        },
                        {
                            "question": "Can instructors and students communicate within Rover?",
                            "answer": "There are discussion forums in Rover where instructors and students can communicate with one another."
                        },
                        {
                            "question": "Is the textbook in Rover?",
                            "answer": "Yes. Rover is a homework tool and there are links from each problem to that section of the textbook. In addition, since this is OpenStax students will always have access to their text."
                        },
                        {
                            "question": "What kind of support will I get?",
                            "answer": "Instructors and students can get support for Rover Monday through Friday, 8 am - 7 pm CT via phone or email. The support team can help with issues such as logging in and accessing the course, payment, setting up your course, among others. More information will be available January 2019."
                        },
                        {
                            "question": "What data does Rover collect from users and how does it keep student data private?",
                            "answer": "OpenStax and Querium, our partner, take privacy very seriously. OpenStax and Querium use the information you give us to provide, maintain, and administer the Rover by OpenStax, as well as to investigate or prevent illegal activities, security or technical issues, etc. Our privacy policy is listed on our website and we are happy to send it to you. In addition, please note that your education records are protected by the \"Family Educational Rights and Privacy Act\" (FERPA). \r\n\r\nIf ever we modify our privacy policy, for example to reflect changes to the service or relevant laws, we will, as applicable, notify you, or your institution of our intended changes and ask you or them to agree to modifications."
                        },
                        {
                            "question": "Is Rover accessible?",
                            "answer": "Yes."
                        },
                        {
                            "question": "Why are you charging for it?",
                            "answer": "Idk"
                        },
                        {
                            "question": "How is this different from OpenStax Tutor?",
                            "answer": "Idk"
                        }
                    ],
                    "id": "2bb1cc26-a2cb-4780-8eb7-6400738bbbe7",
                    "type": "faqs"
                },
                {
                    "value": "Join a webinar",
                    "id": "dbc836fa-8291-43b1-b068-cd968ec4b0b3",
                    "type": "webinar_button_cta"
                },
                {
                    "value": "https://openstax.org",
                    "id": "50e3d604-5407-484c-8e3d-d1a8c78739bf",
                    "type": "webinar_button_url"
                },
                {
                    "value": "https://openstax.org",
                    "id": "45ed750a-1167-488b-90bc-dadff4c72f5f",
                    "type": "signup_button_url"
                },
                {
                    "value": "Sign up to explore",
                    "id": "3807048f-203c-4fb8-a567-9952f4ef36b3",
                    "type": "signup_button_cta"
                }
            ],
            "popup": [
                {
                    "value": [
                        {
                            "sign_in_text": "Sign in or create an account",
                            "background_image": {
                                "id": 496,
                                "file": "https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/mars3_crop.jpg",
                                "title": "Mars Rover 2",
                                "height": 600,
                                "width": 1200,
                                "created_at": "2018-08-16T14:06:39.036304-05:00"
                            },
                            "other_option_url": "https://openstax.org/subjects",
                            "instructions": "Sign in to your OpenStax account or create an account to explore Rover",
                            "headline": "You're one step closer to using affordable, step-by-step math homework in your classroom!",
                            "other_option_text": "Maybe look at our books"
                        }
                    ],
                    "id": "fcfc4ba3-3d32-4fd6-bd6c-e9ff323a90e4",
                    "type": "content"
                }
            ],
            "promote_image": null
        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        const data = this.flattenPageData();
        const headerImage = (data.section_1.image || {}).file;
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
                    description: data.section_6.blurb,
                    moreInfo: `Can't make it? To schedule a one-on-one meeting, email
                    us at <a href="mailto:communications@openstax.org">communications@openstax.org</a>`,
                    image: {
                        image: data.section_6.image.file,
                        altText: data.section_6.imageAltText
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
    }

}
