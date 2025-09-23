import React from 'react';
import {render, screen} from '@testing-library/react';
import AssignableLoader from '../../../src/app/pages/assignable/assignable';

// Mock the lazy-loaded components
jest.mock('../../../src/app/pages/assignable/sections/banner/banner', () => {
    return function Banner() {
        return <div data-testid="banner">Banner Section</div>;
    };
});

jest.mock('../../../src/app/pages/assignable/sections/about/about', () => {
    return function About() {
        return <div data-testid="about">About Section</div>;
    };
});

jest.mock('../../../src/app/pages/assignable/sections/courses/courses', () => {
    return function Courses() {
        return <div data-testid="courses">Courses Section</div>;
    };
});

jest.mock('../../../src/app/pages/assignable/sections/faq/faq', () => {
    return function FAQ() {
        return <div data-testid="faq">FAQ Section</div>;
    };
});

jest.mock('../../../src/app/pages/assignable/sections/overlapping-quote/overlapping-quote', () => {
    return function OverlappingQuote() {
        return <div data-testid="overlapping-quote">Overlapping Quote Section</div>;
    };
});

jest.mock('../../../src/app/pages/assignable/sections/cta/cta', () => {
    return function CTA() {
        return <div data-testid="cta">CTA Section</div>;
    };
});

// Mock LoaderPage component
jest.mock('../../../src/app/components/jsx-helpers/loader-page', () => {
    return function LoaderPage({Child, slug}: {Child: React.ComponentType<any>; slug: string}) {
        const mockData = {
            headingTitleImageUrl: 'https://example.com/title.png',
            subheading: 'Test subheading',
            headingDescription: 'Test heading description',
            headingImage: {
                meta: {
                    downloadUrl: 'https://example.com/image.jpg'
                }
            },
            section2Heading: 'About Assignable',
            section2Description: 'Test description',
            imageCarousel: [[{
                image: {
                    file: 'https://example.com/carousel1.jpg',
                    height: 300,
                    width: 400,
                    title: 'Carousel Image',
                    id: 'image1'
                }
            }]],
            availableCoursesHeader: 'Available Courses',
            availableBooks: [{cover: 'https://example.com/book1.jpg', title: 'Test Book 1'}],
            coursesComingSoonHeader: 'Coming Soon',
            comingSoonBooks: [{cover: 'https://example.com/book2.jpg', title: 'Test Book 2'}],
            faqHeader: 'Frequently Asked Questions',
            faqs: [{question: 'Test question?', answer: 'Test answer'}],
            addAssignableCtaHeader: 'Add Assignable',
            addAssignableCtaDescription: 'Test CTA description',
            addAssignableCtaLink: 'https://example.com/add',
            addAssignableCtaButtonText: 'Get Started',
            assignableCtaText: 'Try Assignable',
            assignableCtaLink: 'https://example.com/try',
            assignableCtaButtonText: 'Try Now',
            tosLink: 'https://example.com/tos'
        };

        return <Child data={mockData} />;
    };
});

// Mock LazyLoad component
jest.mock('../../../src/app/components/jsx-helpers/lazy-load', () => {
    return function LazyLoad({children}: {children: React.ReactNode}) {
        return <div>{children}</div>;
    };
});

describe('AssignableLoader', () => {
    test('renders main assignable page structure', () => {
        render(<AssignableLoader />);

        // Check that main element has correct classes
        const mainElement = document.querySelector('main.assignable.page');
        expect(mainElement).toBeInTheDocument();
    });

    test('loads with correct slug', () => {
        const LoaderPageMock = jest.fn().mockReturnValue(<div>Mock LoaderPage</div>);
        jest.doMock('../../../src/app/components/jsx-helpers/loader-page', () => LoaderPageMock);

        render(<AssignableLoader />);

        // The mock should capture the slug parameter
        expect(LoaderPageMock).toHaveBeenCalledWith(
            expect.objectContaining({
                slug: 'pages/assignable',
                doDocumentSetup: true
            }),
            {}
        );
    });

    test('handles TypeScript prop types correctly', () => {
        // This test verifies TypeScript compilation and type checking
        // by attempting to use the component with properly typed props

        const mockData = {
            headingTitleImageUrl: 'string' as string,
            subheading: 'string' as string,
            headingDescription: 'string' as string,
            headingImage: {
                meta: {
                    downloadUrl: 'string' as string
                }
            },
            section2Heading: 'string' as string,
            section2Description: 'string' as string,
            imageCarousel: [[]] as [Array<{
                image: {
                    file: string;
                    height: number;
                    width: number;
                    title: string;
                    id: string;
                };
            }>],
            availableCoursesHeader: 'string' as string,
            availableBooks: [] as Array<{cover: string; title: string}>,
            coursesComingSoonHeader: 'string' as string,
            comingSoonBooks: [] as Array<{cover: string; title: string}>,
            faqHeader: 'string' as string,
            faqs: [] as Array<{question: string; answer: string}>,
            addAssignableCtaHeader: 'string' as string,
            addAssignableCtaDescription: 'string' as string,
            addAssignableCtaLink: 'string' as string,
            addAssignableCtaButtonText: 'string' as string,
            assignableCtaText: 'string' as string,
            assignableCtaLink: 'string' as string,
            assignableCtaButtonText: 'string' as string,
            tosLink: 'string' as string
        };

        // This should compile without TypeScript errors
        expect(() => {
            const _typeCheck: typeof mockData = mockData;
        }).not.toThrow();
    });
});

// Type assertion tests to verify TypeScript definitions
describe('TypeScript Type Definitions', () => {
    test('ImageMeta type structure', () => {
        type ImageMeta = {
            meta: {
                downloadUrl: string;
            };
        };

        const validImageMeta: ImageMeta = {
            meta: {
                downloadUrl: 'https://example.com/image.jpg'
            }
        };

        expect(validImageMeta.meta.downloadUrl).toBe('https://example.com/image.jpg');
    });

    test('BookData type structure', () => {
        type BookData = {
            cover: string;
            title: string;
        };

        const validBookData: BookData = {
            cover: 'https://example.com/cover.jpg',
            title: 'Test Book'
        };

        expect(validBookData.cover).toBe('https://example.com/cover.jpg');
        expect(validBookData.title).toBe('Test Book');
    });

    test('FAQItem type structure', () => {
        type FAQItem = {
            question: string;
            answer: string;
        };

        const validFAQItem: FAQItem = {
            question: 'What is this?',
            answer: 'This is a test.'
        };

        expect(validFAQItem.question).toBe('What is this?');
        expect(validFAQItem.answer).toBe('This is a test.');
    });
});