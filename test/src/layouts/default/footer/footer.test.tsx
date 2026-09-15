import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import * as UPD from '~/helpers/use-page-data';
import * as PDU from '~/helpers/page-data-utils';
import FooterLoader from '~/layouts/default/footer/footer';
import MemoryRouter from '../../../../helpers/future-memory-router';
import footerMenus from '../../../data/footer-menus';

const mockUsePageData = jest.spyOn(UPD, 'default');
const mockUseDataFromSlug = jest.spyOn(PDU, 'useDataFromSlug');

const footerData = {
    supporters: 'OpenStax is a nonprofit',
    copyright: '© 2024, Rice University.',
    apStatement: 'AP is a trademark',
    socialLinks: [
        {platform: 'facebook', url: 'https://www.facebook.com/openstax'},
        {platform: 'twitter', url: 'https://twitter.com/openstax'},
        {platform: 'linkedin', url: 'https://www.linkedin.com/company/openstax'}
    ]
};

function renderFooter() {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <FooterLoader />
        </MemoryRouter>
    );
}

describe('Footer', () => {
    beforeEach(() => {
        delete (window as any).getCkyConsent; // eslint-disable-line @typescript-eslint/no-explicit-any
        mockUsePageData.mockReturnValue(footerData);
        mockUseDataFromSlug.mockReturnValue(footerMenus);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders columns with the seeded headings and links', () => {
        renderFooter();

        expect(screen.getByRole('heading', {name: 'Help', level: 3})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'OpenStax', level: 3})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Policies', level: 3})).toBeInTheDocument();

        expect(screen.getByRole('link', {name: 'Contact Us'})).toHaveAttribute('href', '/contact');
        expect(screen.getByRole('link', {name: 'Careers'})).toHaveAttribute('href', '/careers');
        expect(screen.getByRole('link', {name: 'Privacy Notice'})).toHaveAttribute('href', '/privacy');
    });

    it('lands the cookie toggle in the Policies column', async () => {
        (window as any).getCkyConsent = jest.fn(); // eslint-disable-line @typescript-eslint/no-explicit-any
        const {container} = renderFooter();

        document.dispatchEvent(new Event('cookieyes_banner_load'));

        await waitFor(() => {
            expect(screen.getByText('Manage cookies')).toBeInTheDocument();
        });

        const policiesHeading = screen.getByRole('heading', {name: 'Policies', level: 3});
        const policiesColumn = policiesHeading.closest('.column');

        expect(policiesColumn?.querySelector('button')?.textContent).toBe('Manage cookies');
        expect(container.querySelectorAll('button').length).toBe(1);
    });

    it('falls back to the last column when no column key is "policies"', async () => {
        (window as any).getCkyConsent = jest.fn(); // eslint-disable-line @typescript-eslint/no-explicit-any
        mockUseDataFromSlug.mockReturnValue(
            footerMenus.map((column) =>
                column.key === 'policies' ? {...column, key: 'legal', name: 'Legal'} : column)
        );

        renderFooter();
        document.dispatchEvent(new Event('cookieyes_banner_load'));

        await waitFor(() => {
            expect(screen.getByText('Manage cookies')).toBeInTheDocument();
        });

        const helpColumn = screen.getByRole('heading', {name: 'Help', level: 3}).closest('.column');
        const legalColumn = screen.getByRole('heading', {name: 'Legal', level: 3}).closest('.column');

        expect(helpColumn?.querySelector('button')).toBeNull();
        expect(legalColumn?.querySelector('button')?.textContent).toBe('Manage cookies');
    });

    it('renders the rest of the footer without throwing when the columns request fails', () => {
        mockUseDataFromSlug.mockReturnValue({error: new Error('Failed to fetch'), slug: 'oxmenus'});

        expect(() => renderFooter()).not.toThrow();

        expect(screen.queryByRole('heading', {level: 3})).toBeNull();
        expect(screen.getByText(footerData.supporters)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Rice University logo'})).toHaveAttribute(
            'href',
            'http://www.rice.edu'
        );
    });

    it('renders the rest of the footer without throwing when the columns response is empty', () => {
        mockUseDataFromSlug.mockReturnValue([]);

        expect(() => renderFooter()).not.toThrow();

        expect(screen.queryByRole('heading', {level: 3})).toBeNull();
        expect(screen.getByText(footerData.supporters)).toBeInTheDocument();
    });

    it('renders social icons from social_links in order and skips an unknown platform', () => {
        mockUsePageData.mockReturnValue({
            ...footerData,
            socialLinks: [
                {platform: 'facebook', url: 'https://www.facebook.com/openstax'},
                {platform: 'carrierpigeon', url: 'https://example.com/nope'},
                {platform: 'mastodon', url: 'https://mastodon.social/@openstax'}
            ]
        });

        const {container} = renderFooter();

        const socialLinkEls = container.querySelectorAll('.social > li > a.btn-social');

        expect(socialLinkEls).toHaveLength(2);
        expect(socialLinkEls[0]).toHaveAttribute('href', 'https://www.facebook.com/openstax');
        expect(socialLinkEls[0]).toHaveAttribute('title', 'OpenStax on Facebook');
        expect(socialLinkEls[1]).toHaveAttribute('href', 'https://mastodon.social/@openstax');
        expect(socialLinkEls[1]).toHaveAttribute('title', 'OpenStax on Mastodon');

        const riceLogo = container.querySelector('.social > li:last-child > .rice-logo');

        expect(riceLogo).not.toBeNull();
    });

    it('falls back to the legacy link fields on a cached pre-release payload', () => {
        const {socialLinks: _unused, ...withoutSocialLinks} = footerData;

        mockUsePageData.mockReturnValue({
            ...withoutSocialLinks,
            facebookLink: 'https://www.facebook.com/openstax',
            twitterLink: 'https://twitter.com/openstax',
            linkedinLink: ''
        });

        const {container} = renderFooter();
        const socialLinkEls = container.querySelectorAll('.social > li > a.btn-social');

        expect(socialLinkEls).toHaveLength(2);
        expect(socialLinkEls[0]).toHaveAttribute('href', 'https://www.facebook.com/openstax');
        expect(socialLinkEls[1]).toHaveAttribute('href', 'https://twitter.com/openstax');
    });

    it('renders no social icons when an editor has removed them all', () => {
        mockUsePageData.mockReturnValue({...footerData, socialLinks: []});

        const {container} = renderFooter();

        expect(
            container.querySelectorAll('.social > li > a.btn-social')
        ).toHaveLength(0);
    });
});
