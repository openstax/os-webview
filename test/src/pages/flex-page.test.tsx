import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import FlexPage from '~/pages/flex-page/flex-page';
import {CTALinkFields} from '~/pages/flex-page/blocks/CTABlock';
import {ContentBlockConfig} from '~/pages/flex-page/blocks/ContentBlock';
import { HeroBlockConfig } from '~/pages/flex-page/blocks/HeroBlock';

const emptyTarget = {
    type: '',
    value: ''
};
const ctaActions: CTALinkFields[] = [
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
        target: emptyTarget
    }
];

type Data = Parameters<typeof FlexPage>[0]['data'];
let body: Data['body'];

function Component() {
    return (
        <MemoryRouter initialEntries={['']}>
            <FlexPage data={{body}} />
        </MemoryRouter>
    );
}

const mockColor = jest.fn();

jest.mock('color', () => (() => mockColor()));
mockColor.mockReturnValue({
    isDark: () => true
});

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
    it('renders heroBlock with top image alignment', () => {
        const modBlock = heroBlock();

        modBlock.value.config.push({
            type: 'image_alignment',
            value: 'top'
        });
        body = [modBlock];
        render(<Component />);
        expect(
            document.querySelector('section[style*="--image-vertical-align: flex-start"]')
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
            document.querySelector('section[style*="--image-vertical-align: flex-end"]')
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
        expect(
            document.querySelector('section.dark-background')
        ).not.toBe(null);
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
});

function imageBlock(name: string) {
    return {
        id: `${name}-image-id`,
        file: `/foo/${name}-image.jpg`,
        height: 400,
        width: 300
    };
}

function heroBlock(): HeroBlockConfig {
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

function ctaBlock(): ContentBlockConfig {
    return {
        id: 'cta-id',
        type: 'cta_block',
        value: {
            actions: ctaActions,
            config: []
        }
    };
}

function cardsBlock(withStyle?: boolean): ContentBlockConfig {
    return {
        id: 'cards-id',
        type: 'cards_block',
        value: {
            cards: [
                {
                    text: 'first card',
                    ctaBlock: withStyle ? ctaActions : []
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

function dividerBlock(aligned: boolean): ContentBlockConfig {
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

function faqBlock(): ContentBlockConfig {
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

function htmlBlock(): ContentBlockConfig {
    return {
        id: 'html-id',
        type: 'html',
        value: '<p>Some html</p>'
    };
}

function linksBlock(): ContentBlockConfig {
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

function quoteBlock(title?: string): ContentBlockConfig {
    return {
        id: 'quote-id',
        type: 'quote',
        value: {
            image: imageBlock('quote'),
            content: 'quote-content',
            name: 'quote-name',
            title
        }
    };
}

function rtBlock(): ContentBlockConfig {
    return {
        id: 'rt-id',
        type: 'text',
        value: 'Some text with <b>formatting</b>'
    };
}

function sectionBlock(): ContentBlockConfig {
    return {
        id: 'section-id',
        type: 'section',
        value: {
            content: [
                {
                    id: 'oops-id',
                    type: 'mistake',
                    value: 'This is invalid content'
                } as unknown as ContentBlockConfig
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
