import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import {ArticleFromSlug} from '~/pages/blog/article/article';
import useScrollProgress from '~/pages/blog/article/use-progress';
import pageData, {featuredVideo, pdfBody} from '~/../../test/src/data/article-page-data';
import * as HelpersData from '~/helpers/data';
import * as WCtx from '~/contexts/window';
import * as DH from '~/helpers/use-document-head';

const mockUsePageData = jest.fn();
const onload = jest.fn();

jest.mock('~/helpers/use-page-data', () => ({
    __esModule: true,
    default: () => mockUsePageData()
}));

const mockJITLoad = jest.fn();

jest.mock('~/helpers/jit-load', () => ({
    __esModule: true,
    default: () => mockJITLoad()
}));

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

describe('blog/article', () => {
    afterEach(() => jest.resetAllMocks());
    it('loads article', () => {
        mockUsePageData.mockReturnValue(pageData);
        render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        expect(onload).toHaveBeenCalled();
        screen.getByText('2 min read');
        expect(document.body.querySelector('.quote-bucket .quote .attribution')).toBeTruthy();
        // Bottom-aligned stuff comes at the end
        expect(document.body.querySelector('.quote-bucket ~ figure.bottom')).toBeTruthy();
        // CTA should be there
        screen.getByRole('link', {name: 'click me'});
    });
    it('handles no data', () => {
        mockUsePageData.mockReturnValue(undefined);
        render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        expect(onload).not.toHaveBeenCalled();
    });
    it('handles data load error', () => {
        mockUsePageData.mockReturnValue({error: {message: 'whoops'}});
        render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        screen.getByText('whoops', {exact: false});
    });
    it('handls PDF article', () => {
        mockUsePageData.mockReturnValue({...pageData, body: pdfBody});
        const {container} = render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        expect(mockJITLoad).toHaveBeenCalled();
        expect(container.querySelector('.pdf-title-block')).toBeTruthy();
    });
    it('handles Video article', () => {
        mockUsePageData.mockReturnValue({...pageData, featuredVideo});
        const {container} = render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        expect(mockJITLoad).not.toHaveBeenCalled();
        expect(container.querySelector('.video-block')).toBeTruthy();
    });
    it('handles empty body', () => {
        mockUsePageData.mockReturnValue({...pageData, body: []});
        render(<ArticleFromSlug slug="whatever" onLoad={onload} />);

        expect(onload).toHaveBeenCalled();
        screen.getByText('0 min read');
    });
});

const mockUseRefreshable = jest.fn();
const mockUseWindowContext = jest.fn();

describe('blog/article/use-progress', () => {
    const Component = () => {
        const ref = React.useRef<HTMLDivElement>(null);
        const p = useScrollProgress(ref);

        return (
            <div ref={ref}>
                {p[0]}
            </div>
        );
    };

    beforeEach(
        () => {
            jest.spyOn(HelpersData, 'useRefreshable').mockImplementation(() => mockUseRefreshable());
            jest.spyOn(WCtx, 'default').mockImplementation(() => mockUseWindowContext());
        }
    );

    afterEach(
        () => jest.clearAllMocks()
    );

    it('returns 0 for negative', () => {
        mockUseRefreshable.mockReturnValue([
            {
                top: 100,
                bottom: 150
            },
            () => null
        ]);
        mockUseWindowContext.mockReturnValue({
            innerHeight: 50,
            scrollY: 0
        });
        render(<Component />);
        screen.getByText('0');
    });
    it('returns 100 for viewport > rect bottom', () => {
        mockUseRefreshable.mockReturnValue([
            {
                top: 0,
                bottom: 50
            },
            () => null
        ]);
        mockUseWindowContext.mockReturnValue({
            innerHeight: 150,
            scrollY: 0
        });
        render(<Component />);
        screen.getByText('100');
    });
    it('returns 100 for viewport > rect bottom', () => {
        mockUseRefreshable.mockReturnValue([
            {
                top: 0,
                bottom: 150,
                height: 150
            },
            () => null
        ]);
        mockUseWindowContext.mockReturnValue({
            innerHeight: 70,
            scrollY: 0
        });
        render(<Component />);
        screen.getByText('47');
    });
});
