import React from 'react';
import ReactModal from 'react-modal';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './dialog.scss';

function PutAway({noTitle, onClick}) {
    return (
        <button
            className={cn('put-away', {'no-title-bar': noTitle})}
            hidden={!onClick}
            onClick={() => onClick()}
        >
            ×
        </button>
    );
}

export function FooterDialog({
    isOpen, title, children
}) {
    const footerEl = document.getElementById('footer');

    if (!isOpen) {
        footerEl.style.removeProperty('z-index');
        return null;
    }

    footerEl.style.zIndex = 1;
    return (
        <dialog className="footer-dialog">
            <div className="title-bar">
                <RawHTML Tag="span" html={title} />
            </div>
            {children}
        </dialog>
    );
}

export default function Dialog({
    isOpen, title, onPutAway, children, className, closeOnOutsideClick
}) {
    // Modal seems to use state for scroll position. If you don't save the
    // position, it scrolls to the top of the page
    if (isOpen) {
        window.history.replaceState({...history.state, y: window.scrollY}, '');
    }

    return (
        <ReactModal
            isOpen={isOpen}
            className={cn('modal', className)}
            overlayClassName="modal-overlay"
            bodyOpenClassName="no-scroll-dialog"
            onRequestClose={onPutAway}
            shouldCloseOnOverlayClick={closeOnOutsideClick}
            shouldCloseOnEsc={closeOnOutsideClick}
        >
            <dialog>
                {
                    title ?
                        <div className="title-bar">
                            <RawHTML Tag="span" html={title} />
                            <PutAway onClick={onPutAway} />
                        </div> :
                        <PutAway noTitle onClick={onPutAway} />
                }
                <div className="main-region">
                    {children}
                </div>
            </dialog>
        </ReactModal>
    );
}

export function useDialog(initiallyOpen=false) {
    const [showDialog, updateShowDialog] = React.useState(initiallyOpen);

    return React.useMemo(() => {
        const open = () => updateShowDialog(true);
        const close = () => updateShowDialog(false);

        function BoundDialog({
            title, children, modal = true, className,
            showPutAway=true, afterClose=() => null,
            ...otherProps
        }) {
            const Modal = modal ? ReactModal : React.Fragment;
            const closeAndAfterClose = () => {
                close();
                afterClose();
            };

            return (
                <Modal
                    isOpen={showDialog}
                    className='modal'
                    overlayClassName="modal-overlay"
                    bodyOpenClassName="no-scroll-dialog"
                    {...otherProps}
                >
                    <Dialog
                        title={title} className={className} isOpen={showDialog}
                        onPutAway={showPutAway && closeAndAfterClose}
                    >
                        {children}
                    </Dialog>
                </Modal>
            );
        }

        return [BoundDialog, open, close];
    }, [showDialog]);
}
