import React from 'react';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import FlexPage, {LayoutUsingData} from '~/pages/flex-page/flex-page';
import { LayoutContextProvider } from '~/contexts/layout';

type Data = Parameters<typeof FlexPage>[0]['data'];
let body: Data['body'];

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={['']}>
                <FlexPage data={{body, layout: [{type: 'landing'}]}} />
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('flex-page', () => {
    beforeAll(() => {
        const el = document.createElement('meta');

        el.setAttribute('name', 'description');
        document.head.appendChild(el);
    });
    it('renders heroBlock', () => {
        body = [heroBlock()];
        render(<Component />);
        expect(screen.getAllByRole('img')).toHaveLength(1);
    });
    it('warns and renders with default when layout is not provided', () => {
        const saveWarn = console.warn;

        console.warn = jest.fn();
        body = [heroBlock()];
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['']}>
                    <LayoutContextProvider>
                        <LayoutUsingData data={{body, layout: []}} >
                            content
                        </LayoutUsingData>
                    </LayoutContextProvider>
                </MemoryRouter>
            </ShellContextProvider>
        );
        expect(console.warn).toHaveBeenCalledWith('No layout set for page');
        console.warn = saveWarn;
    });
    it('renders heroBlock with top image alignment', () => {
        const modBlock = heroBlock();

        modBlock.value.config.push({
            type: 'image_alignment',
            value: 'top'
        });
        body = [modBlock];
        render(<Component />);
        expect(
            document.querySelector(
                'section[style*="--image-vertical-align: flex-start"]'
            )
        ).not.toBe(null);
    });
    it('renders heroBlock with bottom image alignment', () => {
        const modBlock = heroBlock();

        modBlock.value.config.push({
            type: 'image_alignment',
            value: 'bottom'
        });
        body = [modBlock];
        render(<Component />);
        expect(
            document.querySelector(
                'section[style*="--image-vertical-align: flex-end"]'
            )
        ).not.toBe(null);
    });
    it('renders heroBlock with background color', () => {
        const modBlock = heroBlock();

        modBlock.value.config.push({
            type: 'background_color',
            value: '#242424'
        });
        body = [modBlock];
        render(<Component />);
        expect(document.querySelector('section.dark-background')).not.toBe(
            null
        );
    });
    it('renders ctaBlock', () => {
        body = [ctaBlock()];
        render(<Component />);
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
    it('renders cardsBlock', () => {
        body = [cardsBlock(false), cardsBlock(true)];
        render(<Component />);
        expect(screen.getAllByRole('link')).toHaveLength(1);
        expect(screen.getAllByText('first card')).toHaveLength(2);
    });
    it('renders dividerBlock', () => {
        body = [dividerBlock(false), dividerBlock(true)];
        render(<Component />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
    });
    it('renders faqBlock', () => {
        body = [faqBlock()];
        render(<Component />);
        expect(screen.getAllByRole('heading')).toHaveLength(1);
        expect(screen.getAllByRole('button')).toHaveLength(1);
    });
    it('renders htmlBlock', () => {
        body = [htmlBlock()];
        render(<Component />);
        expect(screen.getAllByText('Some html')).toHaveLength(1);
    });
    it('renders linksBlock and sectionBlock', async () => {
        jest.spyOn(window, 'scrollBy').mockImplementation(() => null);
        body = [linksBlock(), sectionBlock()];
        render(<Component />);
        const anchor = screen.getByText('link-text');
        const nonAnchor = screen.getByText('link2-text');
        const missingTarget = screen.getByText('link3-text');
        const user = userEvent.setup();

        await user.click(anchor);
        expect(window.scrollBy).toHaveBeenCalled();

        await user.click(nonAnchor);
        await user.click(missingTarget);
    });
    it('renders quoteBlock', () => {
        body = [quoteBlock(), quoteBlock('quote-title')];
        render(<Component />);
        expect(screen.getAllByText('quote-content')).toHaveLength(2);
        expect(screen.getAllByText('quote-title')).toHaveLength(1);
    });
    it('renders rtBlock', () => {
        body = [rtBlock()];
        render(<Component />);
        expect(screen.getAllByText('Some text with')).toHaveLength(1);
        expect(screen.getAllByText('formatting')).toHaveLength(1);
    });
    it('renders bookListBlock', () => {
        body = [bookListBlock()];
        render(<Component />);
        expect(screen.getAllByText('book title')).toHaveLength(1);
    });
});

function imageBlock(name: string) {
    return {
        id: `${name}-image-id`,
        file: `/foo/${name}-image.jpg`,
        height: 400,
        width: 300
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heroBlock(): any {
    return {
        id: 'hero-id',
        type: 'hero',
        value: {
            content: [],
            config: [],
            image: imageBlock('hero'),
            imageAlt: ''
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ctaBlock(): any {
    return {
        id: 'cta-id',
        type: 'cta_block',
        value: {
            actions: [
                {
                    config: [
                        {
                            type: 'style',
                            value: 'string'
                        }
                    ],
                    text: 'cta-text',
                    target: {
                        type: 'cta-target-type',
                        value: 'cta-target-value'
                    }
                },
                {
                    config: [],
                    text: 'cta-text2',
                    target: {
                        type: '',
                        value: ''
                    }
                }
            ],
            config: []
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cardsBlock(withStyle?: boolean): any {
    return {
        id: 'cards-id',
        type: 'cards_block',
        value: {
            cards: [
                {
                    text: 'first card',
                    ctaBlock: withStyle ? [{
                        config: [
                            {
                                type: 'style',
                                value: 'string'
                            }
                        ],
                        text: 'cta-text',
                        target: {
                            type: 'cta-target-type',
                            value: 'cta-target-value'
                        }
                    }] : []
                }
            ],
            config: withStyle
                ? [
                      {
                          type: 'card_style',
                          id: '',
                          value: 'rounded'
                      }
                  ]
                : []
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dividerBlock(aligned: boolean): any {
    return {
        id: 'divider-id',
        type: 'divider',
        value: {
            image: imageBlock('divider'),
            config: aligned
                ? [
                      {
                          type: 'alignment',
                          value: 'left'
                      }
                  ]
                : []
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function faqBlock(): any {
    return {
        id: 'faq-id',
        type: 'faq',
        value: [
            {
                id: 'q1',
                value: {
                    question: 'what?',
                    slug: 'q1',
                    answer: 'hush',
                    document: ''
                }
            }
        ]
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function htmlBlock(): any {
    return {
        id: 'html-id',
        type: 'html',
        value: '<p>Some html</p>'
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function linksBlock(): any {
    return {
        id: 'links-id',
        type: 'links_group',
        value: {
            links: [
                {
                    text: 'link-text',
                    target: {
                        type: 'anchor',
                        value: '#anchor-target'
                    }
                },
                {
                    text: 'link2-text',
                    target: {
                        type: 'not-anchor',
                        value: ''
                    }
                },
                {
                    text: 'link3-text',
                    target: {
                        type: 'anchor',
                        value: '#not-found'
                    }
                }
            ],
            config: []
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function quoteBlock(title?: string): any {
    return {
        id: 'quote-id',
        type: 'quote',
        value: {
            image: imageBlock('quote'),
            content: 'quote-content',
            name: 'quote-name',
            title,
            config: []
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rtBlock(): any {
    return {
        id: 'rt-id',
        type: 'text',
        value: 'Some text with <b>formatting</b>'
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sectionBlock(): any {
    return {
        id: 'section-id',
        type: 'section',
        value: {
            content: [
                {
                    id: 'oops-id',
                    type: 'mistake',
                    value: 'This is invalid content'
                }
            ],
            config: [
                {
                    type: 'background_color',
                    value: '#f1f1f1'
                },
                {
                    type: 'id',
                    value: 'anchor-target'
                }
            ]
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bookListBlock(): any {
    return {
        id: 'book-list-id',
        type: 'book_list',
        value: {
            books: [
                {
                    id: 1,
                    slug: 'book-slug',
                    title: 'book title',
                    webviewRexLink: 'webview-rex-link',
                    webviewLink: 'webview-link',
                    highResolutionPdfUrl: 'high-res-url',
                    lowResolutionPdfUrl: 'low-res-url',
                    coverUrl: 'cover-url',
                    bookState: 'book-state',
                    promoteSnippet: [],
                    bookstoreComingSoon: false,
                    description: ''
                }
            ]
        }
    };
}
