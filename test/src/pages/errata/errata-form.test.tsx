import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ErrataForm from '~/pages/errata-form/errata-form';
import * as UC from '~/contexts/user';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import rexReleaseData from '~/../../test/src/data/astronomy-toc.json';

const mockUseUserContext = jest.spyOn(UC, 'default');
const mockRexRelease = jest.fn().mockReturnValue(rexReleaseData);

jest.mock('~/models/rex-release', () => ({
    __esModule: true,
    default: () => mockRexRelease()
}));

function Component({bookTitle = 'some-title'}) {
    return (
        <MemoryRouter initialEntries={[`/errata/form?book=${bookTitle}`]}>
            <ErrataForm />
        </MemoryRouter>
    );
}

const user = userEvent.setup();

jest.setTimeout(12000);

describe('errata-form', () => {
    it('renders; shows other source input when Other source selected', async () => {
        mockUseUserContext.mockReturnValue({
            // @ts-expect-error incomplete structure
            uuid: 1
        });
        render(<Component />);
        await waitFor(() =>
            expect(screen.getAllByRole('radio', {name: 'Other'}).length).toBe(2)
        );

        const r = screen.getAllByRole('radio', {name: 'Other'});

        expect(r.length).toBe(2);
        await user.click(r[0]);
        await screen.findByRole('textbox', {name: 'other error type'});
        await user.click(r[1]);
        await screen.findByRole('textbox', {name: 'other source'});
        await user.click(screen.getByRole('button', {name: 'Submit'}));
    });
    it('tells them to log in if they are not', () => {
        // @ts-expect-error incomplete structure
        mockUseUserContext.mockReturnValue({});
        render(<Component bookTitle="book-title&source" />);
        screen.getByText('You need to be logged in to submit errata');
    });
    it('shows title selector if no title comes in', async () => {
        mockUseUserContext.mockReturnValue({
            // @ts-expect-error incomplete structure
            uuid: 1
        });
        render(<Component bookTitle="" />);
        screen.getByText('What book were you in, again?');
        await user.click(await screen.findByRole('combobox'));
        const options = await screen.findAllByRole('option');

        await user.click(options[0]);
    });
    it('handles file uploader', async () => {
        // This covers the revision schedule Nov-Feb
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-07'));
        render(<Component />);
        jest.useRealTimers();
        screen.getByText('November');
        screen.getByText('February');
        await user.click(
            (await screen.findAllByRole('button', {name: 'Add file'}))[0]
        );
        const fileInput = document.querySelector(
            'input[name="file_1"]'
        ) as HTMLInputElement;
        const mockFile = new File(['mock content'], 'mock-file.txt', {
            type: 'text/plain'
        });

        await userEvent.upload(fileInput, mockFile);
        await user.click(screen.getByRole('button', {name: 'Clear file'}));
    });
    it('handles location parameter and toc selection', async () => {
        // This covers the revision schedule Mar-Oct
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-04-07'));
        render(<Component bookTitle="Astronomy&location=somewhere" />);
        jest.useRealTimers();
        screen.getByText('March');
        screen.getByText('October');
        const locationInput = (await screen.findByRole('textbox', {
            name: 'Additional location information, if applicable'
        })) as HTMLInputElement;

        expect(locationInput.value).toBe('somewhere');
        // exercise syncValue code in ErrorLocationSelector
        await user.type(locationInput, ' else');
        screen.getByText('Where in the book did you find the error?');
        // exercise toc-selector
        const select = screen.getByRole<HTMLSelectElement>('listbox');
        const chapter = screen.getByRole('option', {
            name: '+ Chapter 2 Observing the Sky: The Birth of Astronomy'
        });

        await user.click(chapter);
        expect(chapter.textContent?.substring(0, 1)).toBe('–');
        const selection = screen.getByRole<HTMLOptionElement>('option', {
            name: 'Thinking Ahead'
        });

        await user.selectOptions(select, selection.value);
        expect(select.value).toBe(selection.value);
        await user.click(screen.getByRole('button', {name: 'Deselect'}));
        expect(select.value).toBe('');
        // Deselect is ok when nothing is selected
        await user.click(screen.getByRole('button', {name: 'Deselect'}));
        await user.click(chapter);
        expect(chapter.textContent?.substring(0, 1)).toBe('+');
    });
    it('displays no toc selector when source+location are specified', async () => {
        render(
            <Component bookTitle="foo&location=somewhere&source=Assignable" />
        );
        expect(
            (
                (await screen.findByRole('textbox', {
                    name: 'Additional location information, if applicable'
                })) as HTMLInputElement
            ).value
        ).toBe('somewhere');
        expect(
            screen.queryByText('Where in the book did you find the error?')
        ).toBeNull();
    });
    it('checks errors and sets submitting (errata-form-context)', async () => {
        render(
            <Component bookTitle="foo&location=somewhere&source=Assignable" />
        );
        await user.click(screen.getByRole('radio', {name: 'Typo'}));
        await user.click(
            screen.getByRole('radio', {
                name: 'Textbook includes print, PDF, and web view'
            })
        );
        await userEvent.type(
            screen.getByRole('textbox', {
                name: 'Tell us in detail about the error and your suggestion.'
            }),
            'some text'
        );

        const saveFetch = global.fetch;

        global.fetch = jest.fn().mockRejectedValue('intentional fail');
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(global.fetch).toHaveBeenCalled();
        global.fetch = saveFetch;
    });
    it('unpacks json from submission response with id', async () => {
        render(
            <Component bookTitle="foo&location=somewhere&source=Assignable" />
        );
        await user.click(screen.getByRole('radio', {name: 'Typo'}));
        await user.click(
            screen.getByRole('radio', {
                name: 'Textbook includes print, PDF, and web view'
            })
        );
        await userEvent.type(
            screen.getByRole('textbox', {
                name: 'Tell us in detail about the error and your suggestion.'
            }),
            'some text'
        );

        const saveFetch = global.fetch;

        global.fetch = jest.fn().mockResolvedValue({
            json: () => ({
                id: 1
            })
        });
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(global.fetch).toHaveBeenCalled();
        global.fetch = saveFetch;
    });
    it('unpacks json from submission response with no id', async () => {
        render(
            <Component bookTitle="foo&location=somewhere&source=Assignable" />
        );
        await user.click(screen.getByRole('radio', {name: 'Typo'}));
        await user.click(
            screen.getByRole('radio', {
                name: 'Textbook includes print, PDF, and web view'
            })
        );
        await userEvent.type(
            screen.getByRole('textbox', {
                name: 'Tell us in detail about the error and your suggestion.'
            }),
            'some text'
        );

        const saveFetch = global.fetch;

        global.fetch = jest.fn().mockResolvedValue({
            json: () => ({
                submitted_by_account_id: [2] // eslint-disable-line camelcase
            })
        });
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(global.fetch).toHaveBeenCalled();
        // The banned dialog displays
        screen.getByRole('dialog');
        await user.click(screen.getByRole('button', {name: 'close'}));
        global.fetch = saveFetch;
    });
    it('unpacks json from submission response with no id or submitted-by id', async () => {
        render(
            <Component bookTitle="foo&location=somewhere&source=Assignable" />
        );
        await user.click(screen.getByRole('radio', {name: 'Typo'}));
        await user.click(
            screen.getByRole('radio', {
                name: 'Textbook includes print, PDF, and web view'
            })
        );
        await userEvent.type(
            screen.getByRole('textbox', {
                name: 'Tell us in detail about the error and your suggestion.'
            }),
            'some text'
        );

        const fileInput = document.querySelector(
            'input[name="file_1"]'
        ) as HTMLInputElement;
        const mockFile = new File(['mock content'], 'mock-file.txt', {
            type: 'text/plain'
        });

        await userEvent.upload(fileInput, mockFile);

        const saveFetch = global.fetch;

        global.fetch = jest.fn().mockResolvedValue({
            json: () => ({})
        });
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        expect(global.fetch).toHaveBeenCalled();
        global.fetch = saveFetch;
    });
});
