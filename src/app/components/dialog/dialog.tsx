import React from 'react';
import ReactModal, {Aria} from 'react-modal';
import RawHTML from '~/components/jsx-helpers/raw-html';
import cn from 'classnames';
import './dialog.scss';

function PutAway({noTitle, onClick}: {
    noTitle?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            className={cn('put-away', {'no-title-bar': noTitle})}
            hidden={!onClick}
            onClick={() => onClick?.()}
            aria-label="close"
        >
            ×
        </button>
    );
}

export default function Dialog({
    isOpen,
    title,
    onPutAway,
    children,
    className,
    closeOnOutsideClick = false,
    aria = title ? {labelledby: 'modal-dialog-title'} : {label: 'missing label'}
}: React.PropsWithChildren<{
    isOpen: boolean;
    title?: string;
    onPutAway?: () => void;
    className?: string;
    closeOnOutsideClick?: boolean;
    aria?: Aria & {label?: string};
}>) {
    const overlayClassName = className ? `modal-overlay-${className}` : '';

    return (
        <ReactModal
            isOpen={isOpen}
            className={cn('modal', className)}
            overlayClassName={cn('modal-overlay', overlayClassName)}
            bodyOpenClassName="no-scroll-dialog"
            onRequestClose={onPutAway}
            shouldCloseOnOverlayClick={closeOnOutsideClick}
            shouldCloseOnEsc={closeOnOutsideClick}
            aria={aria}
        >
            {title ? (
                <div className="title-bar" id="modal-dialog-title">
                    <RawHTML Tag="span" html={title} />
                    <PutAway onClick={onPutAway} />
                </div>
            ) : (
                <PutAway noTitle onClick={onPutAway} />
            )}
            <div className="main-region">{children}</div>
        </ReactModal>
    );
}

export function useDialog(initiallyOpen = false) {
    const [showDialog, updateShowDialog] = React.useState(initiallyOpen);

    return React.useMemo(() => {
        const open = () => updateShowDialog(true);
        const close = () => updateShowDialog(false);

        function BoundDialog({
            title,
            children,
            modal = true,
            className,
            showPutAway = true,
            afterClose = () => null,
            aria,
            ...otherProps
        }: React.PropsWithChildren<{
            title?: string;
            modal?: boolean;
            className?: string;
            showPutAway?: boolean;
            afterClose?: () => void;
            aria?: Aria;
        }>) {
            const Modal = modal ? ReactModal : React.Fragment;
            const closeAndAfterClose = () => {
                close();
                afterClose();
            };

            return (
                <Modal
                    isOpen={showDialog}
                    className="modal"
                    overlayClassName="modal-overlay"
                    bodyOpenClassName="no-scroll-dialog"
                    {...otherProps}
                >
                    <Dialog
                        title={title}
                        className={className}
                        isOpen={showDialog}
                        onPutAway={showPutAway ? closeAndAfterClose : undefined}
                        aria={aria}
                    >
                        {children}
                    </Dialog>
                </Modal>
            );
        }

        return [BoundDialog, open, close, showDialog] as const;
    }, [showDialog]);
}
