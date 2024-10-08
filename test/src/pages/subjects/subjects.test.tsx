import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import SubjectsRouter from '~/pages/subjects/new/subjects';
import * as updParent from '~/helpers/use-page-data';
import {describe, test} from '@jest/globals';

jest.mock('~/components/shell/announce-page-title', () => ({
    __esModule: true,
    PageTitleConfirmation: jest.fn(),
    default: jest.fn()
}));

const subjectPageData = {
    id: 413,
    meta: {
        seoTitle: '',
        searchDescription: '',
        type: 'pages.Subjects',
        detailUrl: 'https://dev.openstax.org/apps/cms/api/v2/pages/413/',
        htmlUrl: 'https://dev.openstax.org/subjects',
        slug: 'new-subjects',
        showInMenus: false,
        firstPublishedAt: '2022-02-08T13:36:02.626084-06:00',
        aliasOf: null,
        parent: {
            id: 29,
            meta: {
                type: 'pages.HomePage',
                detailUrl: 'https://dev.openstax.org/apps/cms/api/v2/pages/29/',
                htmlUrl: 'https://dev.openstax.org/'
            },
            title: 'Openstax Homepage'
        },
        locale: 'en'
    },
    title: 'New Subjects',
    heading: 'Browse our subjects',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    headingImage: {
        id: 779,
        meta: {
            width: 390,
            height: 372,
            type: 'wagtailimages.Image',
            detailUrl: 'https://dev.openstax.org/apps/cms/api/v2/images/779/',
            downloadUrl:
                'https://assets.openstax.org/oscms-dev/media/original_images/OpenStax_SubjectsImage_1.png'
        },
        title: 'Seated student'
    },
    tutorAd: [
        {
            type: 'content',
            value: {
                heading: 'Instructors, take your course online',
                image: {
                    id: 773,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/Group_54.png',
                    title: 'Computer with rising graph and learn more button',
                    height: 147,
                    width: 260,
                    createdAt: '2022-05-27T12:13:44.311511-05:00'
                },
                adHtml: '<strong>Assign homework and readings synced with OpenStax textbooks</strong>',
                linkText: 'Learn more',
                linkHref: 'https://dev.openstax.org/openstax-tutor'
            },
            id: '7bed790f-79f2-4e5a-97af-8581f5b944dd'
        }
    ],
    aboutOs: [
        {
            type: 'content',
            value: {
                heading: 'About Openstax textbooks',
                image: {
                    id: 743,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/Books_Devices_Mockup_Final_agR6ob9.webp',
                    title: 'Books Devices Mockup_Final.webp',
                    height: 805,
                    width: 1462,
                    createdAt: '2021-05-06T16:13:16.043056-05:00'
                },
                osText: 'OpenStax is part of Rice University, a 501(c)(3) nonprofit charitable corporation...',
                linkText: 'Learn about OpenStax',
                linkHref: 'https://dev.openstax.org'
            },
            id: '08662989-fd7f-4083-952d-db3f1d4cdbbb'
        }
    ],
    infoBoxes: [
        {
            type: 'info_box',
            value: [
                {
                    image: {
                        id: 774,
                        file: 'https://assets.openstax.org/oscms-dev/media/original_images/Vector.png',
                        title: 'Authors icon',
                        height: 40,
                        width: 40,
                        createdAt: '2022-05-27T12:16:32.717889-05:00'
                    },
                    heading: 'Expert Authors',
                    text: 'Our free, openly ...'
                }
            ],
            id: '81f82b27-6d4c-4fb0-bcba-988a55b9cdd5'
        }
    ],
    philanthropicSupport:
        "With philanthropic support, our books have been used in <strong>38,160</strong> classrooms, saving students <strong>$1,747,190,405</strong> since 2012. <a href='https://openstax.org/impact'>Learn more about our impact</a> and how you can help.",
    subjects: {
        Business: {
            icon: 'https://assets.openstax.org/oscms-dev/media/original_images/noun_presentation_3480624_1.png',
            categories: [
                'Accounting',
                'Entrepreneurship',
                'General Business',
                'Management',
                'Statistics'
            ]
        },
        'College Success': {
            icon: 'https://assets.openstax.org/oscms-dev/media/original_images/noun_Medal_3479742_1.png',
            categories: []
        },
        Essentials: {
            icon: null,
            categories: []
        },
        Humanities: {
            icon: 'https://assets.openstax.org/oscms-dev/media/original_images/noun_Globe_3480625_1.png',
            categories: []
        }
    },
    translations: [
        {
            type: 'translation',
            value: [
                {
                    locale: 'es',
                    slug: 'temas-nuevos'
                },
                {
                    locale: 'en',
                    slug: 'new-subjects'
                }
            ],
            id: '1a599834-5137-49da-bd0e-c2dd8943a6d6'
        }
    ],
    books: [
        {bookState: 'retired'},
        {bookState: 'live'}
    ],
    promoteImage: null,
    slug: 'pages/new-subjects',
    devStandardsHeading: 'Development Standards',
    devStandard1Heading: 'Expert Authors',
    devStandard1Description:
        '<p data-block-key="akbub">Our open source ... who are experts in their fields.<br/></p>'
};

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={['/subjects/']}>
                <Routes>
                    <Route path="/:name/*" element={<SubjectsRouter />} />
                </Routes>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('subjects page', () => {
    test('main subjects page', async () => {
        render(<Component />);
        await screen.findByText('Browse our subjects');
        await screen.findByText('We have textbooks in', {exact: false});
        await screen.findByText('Business');
    });
    test('with pageDescription and without translations', async () => {
        jest.spyOn(updParent, 'default').mockReturnValue(subjectPageData);
        render(<Component />);
        await screen.findByText('Browse our subjects');
    });
});
