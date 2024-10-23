import React from 'react';
import ReactModal from 'react-modal';

type DialogProps = React.PropsWithChildren<{
    isOpen?: boolean;
    title?: string;
    onPutAway?: () => void;
    className?: string;
    closeOnOutsideClick?: boolean;
}>

export default function Dialog({
    isOpen,
    title,
    onPutAway,
    children,
    className,
    closeOnOutsideClick
}: DialogProps): React.ReactNode;

export function useDialog(
    initallyOpen?: boolean
): [
    BoundDialog: ({
        children
    }: DialogProps & {aria?: ReactModal.Aria}) => React.ReactNode,
    open: () => void,
    close: () => void,
    showDialog: boolean
];
