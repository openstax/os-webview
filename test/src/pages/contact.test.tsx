import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import ContactPage from '~/pages/contact/contact';
import Form from '~/pages/contact/form';
import * as UPD from '~/helpers/use-page-data';
import * as UDH from '~/helpers/use-document-head';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import * as SFF from '~/components/salesforce-form/salesforce-form';
import '~/../../test/src/helpers/mock-recaptcha';

const spyUsePageData = jest.spyOn(UPD, 'default');
/* eslint-disable max-len */
const pageData = {
    id: 318,
    meta: {
        slug: 'contact',
        seoTitle:
            'Let us know if you have any questions or comments about our content',
        searchDescription:
            'Do you have a question or comment about OpenStax and want to let us know? Fill out our Contact Us form. We would love to hear your thoughts!',
        type: 'pages.ContactUs',
        detailUrl: 'https://dev.openstax.org/apps/cms/api/v2/pages/318/',
        htmlUrl: 'https://dev.openstax.org/contact/',
        showInMenus: false,
        firstPublishedAt: '2016-06-23T10:25:21.881000-05:00',
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
    title: 'Contact Us',
    tagline: 'If you have any questions or feedback, drop us a line!',
    mailingHeader: 'Mailing Address',
    mailingAddress:
        '<h3 data-block-key="nek5u">OpenStax</h3><p data-block-key="4sbtp">Rice University<br/>6100 Main Street MS-375<br/>Houston, TX 77005</p>',
    customerService:
        '<p data-block-key="9iesw"><b>Need help?</b><br/>Visit our <a href="https://help.openstax.org">Support Center</a>.<br/></p>',
    promoteImage: null,
    slug: 'pages/contact'
};

function Component({path='/contact'}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <SalesforceContextProvider>
                <ContactPage />
            </SalesforceContextProvider>
        </MemoryRouter>
    );
}

jest.spyOn(SFF, 'default').mockImplementation(MockSfForm);
jest.spyOn(UDH, 'setPageTitleAndDescriptionFromBookData').mockImplementation(
    () => null
);

describe('contact page', () => {
    const user = userEvent.setup();

    it('returns loader page until data', () => {
        spyUsePageData.mockReturnValue(undefined);
        render(<Component />);

        expect(document.body.textContent).toBe('');
    });
    it('displays the form', async () => {
        spyUsePageData.mockReturnValue(pageData);
        render(<Component />);

        const getLoadingText = () => screen.getByText('Loading...');

        await waitFor(() => expect(getLoadingText).toThrow());
        const inputs = screen.getAllByRole('textbox');

        expect(inputs).toHaveLength(3);
        // Fill out the form
        await user.click(screen.getByRole('combobox'));
        const polskaOption = screen.getByRole('option', {
            name: 'OpenStax Polska'
        });

        await user.click(polskaOption as HTMLElement);
        const [nameBox, emailBox, messageBox] = [
            'Your Name',
            'Your Email Address',
            'Your Message'
        ].map((name) => screen.getByRole('textbox', {name}));
        const submitButton = screen.getByRole('button', {name: 'Submit'});

        fireEvent.change(nameBox, {target: {value: 'Username'}});
        fireEvent.change(emailBox, {target: {value: 'somebody@example.com'}});
        fireEvent.change(messageBox, {target: {value: 'message text'}});

        await user.click(submitButton);
    });
    it('displays as embedded', async () => {
        const setSubmitted = jest.fn();

        spyUsePageData.mockReturnValue(pageData);
        render(
            <MemoryRouter initialEntries={['/embedded/contact?body=1&body=2']}>
                <SalesforceContextProvider>
                    <Form setSubmitted={setSubmitted} />
                </SalesforceContextProvider>
            </MemoryRouter>
        );
        const getLoadingText = () => screen.getByText('Loading...');

        await waitFor(() => expect(getLoadingText).toThrow());
        const [questionBox, topicBox] = screen.getAllByRole('combobox');

        expect(questionBox.textContent).toBe('OpenStax Assignable');
        await user.click(topicBox);
        await user.click(screen.getByRole('option', {
            name: 'Grade book'
        }));

        const [nameBox, emailBox, messageBox] = [
            'Your Name',
            'Your Email Address',
            'Your Message'
        ].map((name) => screen.getByRole('textbox', {name}));
        const submitButton = screen.getByRole('button', {name: 'Submit'});

        fireEvent.change(nameBox, {target: {value: 'Username'}});
        fireEvent.change(emailBox, {target: {value: 'somebody@example.com'}});
        fireEvent.change(messageBox, {target: {value: 'message text'}});

        await user.click(submitButton);
        expect(setSubmitted).toHaveBeenCalledWith(true);
    });
});

function MockSfForm({children, postTo, afterSubmit}: React.PropsWithChildren<{
    postTo: string;
    afterSubmit: () => void;
}>) {
    const onSubmit = React.useCallback(
        (event: Pick<Event, 'preventDefault'>) => {
            event?.preventDefault();
            afterSubmit();
        },
        [afterSubmit]
    );

    return (
        <React.Fragment>
            <form
                action={postTo} method="post"
                onSubmit={onSubmit}
            >
                <div className="form-content">
                    {children}
                </div>
            </form>
        </React.Fragment>
    );
}
