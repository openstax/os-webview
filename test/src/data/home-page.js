/* eslint-disable max-len, camelcase */
export default {
    id: 542,
    meta: {
        slug: 'home',
        seo_title: 'OpenStax',
        search_description:
            'This is the meta description for the head tag. woooo!',
        type: 'pages.RootPage',
        detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/542/',
        html_url: 'https://dev.openstax.org',
        show_in_menus: false,
        first_published_at: '2024-07-15T10:48:11.270293-05:00',
        alias_of: null,
        parent: null,
        locale: 'en'
    },
    title: 'Home',
    layout: [
        {
            type: 'default',
            value: {},
            id: 'fac03294-24f0-4686-9637-29d4291a6592'
        }
    ],
    body: [
        {
            type: 'hero',
            value: {
                content: [
                    {
                        type: 'text',
                        value: '<h1 data-block-key="yllv5">Free. For all!</h1><p data-block-key="6f83s">OpenStax is a nonprofit initiative of Rice University. We are proud to be the largest global publisher of open education resources (OER)</p>',
                        id: '5281be39-7e0f-4a89-b592-5b6064dc6f6f'
                    },
                    {
                        type: 'cta_block',
                        value: {
                            actions: [
                                {
                                    text: 'Find your subject',
                                    aria_label: '',
                                    target: {
                                        value: 'https://dev.openstax.org/subjects',
                                        type: 'external'
                                    },
                                    config: []
                                }
                            ],
                            config: []
                        },
                        id: '2207e011-f758-4fb5-b6b2-17cce00d2b6f'
                    }
                ],
                image: {
                    id: 923,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/hero-image-AM.png',
                    title: 'hero-image-AM',
                    height: 310,
                    width: 585,
                    created_at: '2024-07-18T14:53:04.322362-05:00'
                },
                image_alt: '',
                config: [
                    {
                        type: 'background_color',
                        value: '#f7fcff',
                        id: '3fe09b72-9d71-4c06-af08-38caef312e57'
                    },
                    {
                        type: 'padding',
                        value: 2,
                        id: 'e6c12fb9-5e67-43b5-bc61-195c235c7fb5'
                    }
                ]
            },
            id: '198bc0f1-196d-4aed-a063-81b1cf9df2b1'
        },
        {
            type: 'divider',
            value: {
                image: {
                    id: 927,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/confetti_1.svg',
                    title: 'confetti 1',
                    height: 543,
                    width: 440,
                    created_at: '2024-07-22T06:17:43.168614-05:00'
                },
                config: [
                    {
                        type: 'alignment',
                        value: 'content_right',
                        id: '362ff8f9-aadb-4f9a-81d7-88e234cfaa89'
                    },
                    {
                        type: 'offset_horizontal',
                        value: '15rem',
                        id: '3dd5968a-71b6-4991-b961-41fb30ddd724'
                    },
                    {
                        type: 'offset_vertical',
                        value: '-45%',
                        id: '43c5ca13-5d9f-4fbf-8af1-9316cefd057e'
                    },
                    {
                        type: 'width',
                        value: '33rem',
                        id: 'b5aff431-f664-4a88-9da0-499c29012cb4'
                    }
                ]
            },
            id: '25716296-8df6-419f-bf68-59ad8c1a2e5a'
        },
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'cards_block',
                        value: {
                            cards: [
                                {
                                    text: '<h2 data-block-key="be9s5">25 years of making a difference</h2><p data-block-key="4qd48">We have saved 36.1 million students $2.9 billion across 150 countries</p>',
                                    cta_block: [
                                        {
                                            text: 'Support OpenStax',
                                            aria_label: '',
                                            target: {
                                                value: 'https://openstax.com/give',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<h2 data-block-key="mw6av">More than free textbooks</h2><p data-block-key="1k4p8">A library of 70+ free resources with supporting, research-informed products for every classroom</p>',
                                    cta_block: [
                                        {
                                            text: 'Find your subject',
                                            aria_label: '',
                                            target: {
                                                value: '/home/new-subjects/',
                                                type: 'internal'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<h2 data-block-key="mw6av">Teach freely, learn equitably</h2><p data-block-key="cj7va">Knowledge is a public good, not a privilege. OpenStax values inclusivity, representation, and the democratization of knowledge</p>',
                                    cta_block: [
                                        {
                                            text: 'Read our DEI commitment',
                                            aria_label: '',
                                            target: {
                                                value: 'https://openstax.org/blog/dei-commitment-/',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<h2 data-block-key="vcj78">Educating the world takes a village</h2><p data-block-key="7si2g">OpenStax partners with EdTech organizations to deliver low-cost, high-value instructional tools.</p>',
                                    cta_block: [
                                        {
                                            text: 'Search courseware',
                                            aria_label: '',
                                            target: {
                                                value: 'https://openstax.org/partners',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                }
                            ],
                            config: [
                                {
                                    type: 'card_style',
                                    value: 'rounded',
                                    id: 'd05af7c6-7f48-4d35-a243-8ca214668ac2'
                                }
                            ]
                        },
                        id: '386311be-3f4d-4efd-aeb1-25eb7ffca62d'
                    }
                ],
                config: [
                    {
                        type: 'background_color',
                        value: '#ffffff',
                        id: '1261e379-7915-4fe2-ac27-fbd4249a9ed4'
                    },
                    {
                        type: 'padding',
                        value: 4,
                        id: 'ffa43f2b-d74d-4a09-b827-30a19f982cfe'
                    }
                ]
            },
            id: 'd065e7ee-0f14-4b2b-81fe-3acd23e0e438'
        },
        {
            type: 'divider',
            value: {
                image: {
                    id: 928,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/confetti_2.svg',
                    title: 'confetti 2',
                    height: 543,
                    width: 439,
                    created_at: '2024-07-22T06:18:04.239376-05:00'
                },
                config: [
                    {
                        type: 'alignment',
                        value: 'content_left',
                        id: '6ba022ef-1d75-48e2-afec-4ae020486afc'
                    },
                    {
                        type: 'offset_horizontal',
                        value: '-20rem',
                        id: '152e6897-8c3f-485c-a06f-52de534dd1c1'
                    },
                    {
                        type: 'width',
                        value: '33rem',
                        id: '91267601-eedd-45a0-a545-79b2ca01e109'
                    }
                ]
            },
            id: 'db33793e-846e-460e-9187-de2c9e2ff721'
        },
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'cards_block',
                        value: {
                            cards: [
                                {
                                    text: '<h2 data-block-key="hol3x">Higher Ed</h2><img alt="" class="richtext-image full-width" height="120" src="https://assets.openstax.org/oscms-dev/media/images/pillar-1-AM.width-800.webp" width="240"><p data-block-key="8ajns">We publish high-quality, peer-reviewed, openly licensed college textbooks that are absolutely free online and low-cost in print.</p>',
                                    cta_block: [
                                        {
                                            text: 'Find your subject',
                                            aria_label: '',
                                            target: {
                                                value: '/home/new-subjects/',
                                                type: 'internal'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<h2 data-block-key="vcj78">K12</h2><img alt="" class="richtext-image full-width" height="120" src="https://assets.openstax.org/oscms-dev/media/images/pillar-2-AM.width-800.webp" width="240"><p data-block-key="389ui">Textbooks and Resources for K12 Educators - for free!</p>',
                                    cta_block: [
                                        {
                                            text: 'Explore K12 Free Resources',
                                            aria_label: '',
                                            target: {
                                                value: '/home/k12/',
                                                type: 'internal'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<h2 data-block-key="vcj78">Learning Research</h2><img alt="" class="richtext-image full-width" height="120" src="https://assets.openstax.org/oscms-dev/media/images/pillar-3-AM.width-800.webp" width="240"><p data-block-key="9k8vf">Get personalized learning insights and earn recognition badges. OpenStax Kinetic is a platform to understand how people learn.</p>',
                                    cta_block: [
                                        {
                                            text: 'Try OpenStax Kinetic',
                                            aria_label: '',
                                            target: {
                                                value: '/home/kinetic/',
                                                type: 'internal'
                                            },
                                            config: []
                                        }
                                    ]
                                }
                            ],
                            config: [
                                {
                                    type: 'card_style',
                                    value: 'square',
                                    id: 'ef6ecfed-54ab-4314-8cfa-83f9b2618fd5'
                                }
                            ]
                        },
                        id: 'f2a2915f-46e9-40dd-a214-b021dccf8c2a'
                    }
                ],
                config: [
                    {
                        type: 'background_color',
                        value: '#f7fcff',
                        id: '298bdbe0-534e-4b16-8a74-829901ec50f3'
                    },
                    {
                        type: 'padding',
                        value: 4,
                        id: '3f5b4754-f0d6-4c5e-b560-bc7a638be92c'
                    }
                ]
            },
            id: 'a047d73e-684d-4202-9a35-86b834ab4c2f'
        },
        {
            type: 'divider',
            value: {
                image: {
                    id: 929,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/confetti_3.svg',
                    title: 'confetti 3',
                    height: 543,
                    width: 440,
                    created_at: '2024-07-22T06:18:26.263221-05:00'
                },
                config: [
                    {
                        type: 'alignment',
                        value: 'content_right',
                        id: 'c66528c3-b224-4383-b693-6e9ad4a2c2a5'
                    },
                    {
                        type: 'offset_horizontal',
                        value: '10rem',
                        id: '6e9984c0-6b23-48c1-a772-c2dbc1ca877d'
                    },
                    {
                        type: 'width',
                        value: '33rem',
                        id: '14a43b33-e86b-41c9-8d27-ddbee5c2ff97'
                    },
                    {
                        type: 'offset_vertical',
                        value: '-80%',
                        id: '6e79e375-1047-4c37-92ac-48a6ef48f158'
                    }
                ]
            },
            id: 'faba493f-e9e7-4f9f-9f5d-2ed828436da9'
        },
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'text',
                        value: '<h2 data-block-key="c66je">What&#x27;s new at OpenStax</h2>',
                        id: '747c41c8-7957-44c8-a86b-92ce3d2cf004'
                    },
                    {
                        type: 'cards_block',
                        value: {
                            cards: [
                                {
                                    text: '<p data-block-key="hol3x"></p><img alt="" class="richtext-image full-width" height="532" src="https://assets.openstax.org/oscms-dev/media/images/Screen_Shot_2024-07-18_at_11.14.14_AM.width-800.webp" width="710"><h3 data-block-key="1ucg1">Mindset shift: From praising effort to motivating learning</h3><p data-block-key="elpd6">Exploring the nuances of growth mindset implementation in classrooms</p>',
                                    cta_block: [
                                        {
                                            text: 'Read more',
                                            aria_label:
                                                'Read more: Mindset shift: From praising effort to motivating learning',
                                            target: {
                                                value: 'https://google.com',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<p data-block-key="vcj78"></p><img alt="" class="richtext-image full-width" height="538" src="https://assets.openstax.org/oscms-dev/media/images/Screen_Shot_2024-07-18_at_11.14.28_AM.width-800.webp" width="712"><h3 data-block-key="8hltf">Celebrating the resilience of the Class of 2024</h3><p data-block-key="4uke4">A Message from OpenStax</p>',
                                    cta_block: [
                                        {
                                            text: 'Read more',
                                            aria_label:
                                                'Read more: Celebrating the resilience of the Class of 2024',
                                            target: {
                                                value: 'https://google.com',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<p data-block-key="vcj78"></p><img alt="" class="richtext-image full-width" height="536" src="https://assets.openstax.org/oscms-dev/media/images/Screen_Shot_2024-07-18_at_11.14.45_AM.width-800.webp" width="706"><h3 data-block-key="1s7i9">OpenStax Astronomy reaches over 1 million students</h3><p data-block-key="9451l">Free, openly licensed textbook has saved students over $84 million since 2016</p>',
                                    cta_block: [
                                        {
                                            text: 'Read more',
                                            aria_label:
                                                'Read more: OpenStax Astronomy reaches over 1 million students',
                                            target: {
                                                value: 'https://google.com',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                },
                                {
                                    text: '<p data-block-key="vcj78"></p><img alt="" class="richtext-image full-width" height="538" src="https://assets.openstax.org/oscms-dev/media/images/Screen_Shot_2024-07-18_at_11.14.53_AM.width-800.webp" width="708"><h3 data-block-key="j2o8">The success of productive failure</h3><p data-block-key="clhdb">Students who struggle experience a boost in conceptual understanding</p>',
                                    cta_block: [
                                        {
                                            text: 'Read more',
                                            aria_label:
                                                'Read more: The success of productive failure',
                                            target: {
                                                value: 'https://google.com',
                                                type: 'external'
                                            },
                                            config: []
                                        }
                                    ]
                                }
                            ],
                            config: []
                        },
                        id: '144c114e-81c2-47f8-8664-b5bc2ebffdfc'
                    }
                ],
                config: [
                    {
                        type: 'background_color',
                        value: '#ffffff',
                        id: '292a36a1-3793-4a68-9c67-8cff3ce7aaef'
                    },
                    {
                        type: 'padding',
                        value: 2,
                        id: '0a75b651-9f36-4f47-8b37-f592735d669e'
                    }
                ]
            },
            id: 'a84212c0-b66d-48d3-b946-c0f1ec9a687e'
        },
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'text',
                        value: '<h2 data-block-key="c66je">Interested in using OpenStax?</h2><p data-block-key="2sr8q">We’ll show you how to take advantage of all that OpenStax has to offer.</p>',
                        id: '948b078f-e679-420d-be92-c9a332b30ff0'
                    },
                    {
                        type: 'cta_block',
                        value: {
                            actions: [
                                {
                                    text: "I'm interested!",
                                    aria_label: '',
                                    target: {
                                        value: 'https://google.com',
                                        type: 'external'
                                    },
                                    config: []
                                }
                            ],
                            config: []
                        },
                        id: 'def150bc-4955-4655-bcaf-820f591ddbb4'
                    }
                ],
                config: [
                    {
                        type: 'padding',
                        value: 8,
                        id: 'ec0b8aba-bf43-4549-ac76-35e64917a3b2'
                    },
                    {
                        type: 'text_alignment',
                        value: 'center',
                        id: '4d5100b9-9053-4ab0-b7ff-d26423adba6d'
                    },
                    {
                        type: 'background_color',
                        value: '#f7fcff',
                        id: '566656cd-70d4-4295-9730-15522dca3d5c'
                    }
                ]
            },
            id: '91a39753-2c32-4104-93bf-183adfa16246'
        }
    ]
};
