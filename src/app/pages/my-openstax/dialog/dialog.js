import React, { useState } from 'react';
import ReactModal from 'react-modal';
import PutAway from '~/pages/my-openstax/put-away/put-away';
import './dialog.scss';

export function Dialog({
    isOpen, title, doClose, children
}) {
    return (
        <dialog open={isOpen}>
            <div className='title-bar'>
                <span>{title}</span>
                <PutAway onClick={doClose} />
            </div>
            <div className='content'>
                {children}
            </div>
        </dialog>
    );
}

export default function useDialog() {
    const [showDialog, updateShowDialog] = useState(false);
    const open = () => updateShowDialog(true);
    const close = () => updateShowDialog();

    function BoundDialog({ title, children, modal = true, ...otherProps }) {
        const Modal = modal ? ReactModal : React.Fragment;

        return (
            <Modal
                isOpen={showDialog}
                className='modal'
                overlayClassName="modal-overlay"
                bodyOpenClassName="no-scroll-dialog"
                {...otherProps}
            >
                <Dialog title={title} isOpen={showDialog} doClose={close}>
                    {children}
                </Dialog>
            </Modal>
        );
    }

    return [BoundDialog, open, close];
}
