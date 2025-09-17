import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import Dialog, {useDialog} from '~/components/dialog/dialog';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('components/dialog', () => {
    function Component({showPutAway, modal}: {showPutAway?: boolean, modal?: boolean}) {
        const [BDialog, open, close, isOpen] = useDialog();
        const toggle = isOpen ? close : open;

        return <div>
            <button onClick={toggle}>Toggle</button>
            <BDialog title="bdialog" showPutAway={showPutAway} modal={modal} />
        </div>;
    }
    it('sets overlay classname', async () => {
        const pa = jest.fn();

        render(<Dialog isOpen={true} onPutAway={pa} className='foo' />);
        await waitFor(() => expect(document.querySelector('.modal-overlay-foo')).toBeTruthy());
    });
    it('uses default afterClose', async () => {
        render(<Component />);
        const b = screen.getByRole('button');

        await user.click(b);

        const pa = await screen.findByRole('button', {name: 'close'});

        await user.click(pa);
    });
    it('pressing Escape is the same as pressing close button', async () => {
        render(<Component />);
        const b = screen.getByRole('button');

        await user.click(b);
        await screen.findByRole('button', {name: 'close'});
        await userEvent.type(document.body, '{Enter}');
        expect(screen.queryByRole('button', {name: 'close'})).toBeTruthy();
        await userEvent.type(document.body, '{Escape}');
        expect(screen.queryByRole('button', {name: 'close'})).not.toBeTruthy();
    });
    it('Handles nonmodal and no put-away', async () => {
        render(<Component showPutAway={false} modal={false} />);
        const b = screen.getByRole('button');

        await user.click(b);
        await expect(screen.findByRole('button', {name: 'close'})).rejects.toThrow();
    });
});
