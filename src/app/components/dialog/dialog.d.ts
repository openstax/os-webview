import React from 'react';
import ReactModal from 'react-modal';

export default function Dialog({
    isOpen,
    title,
    onPutAway,
    children,
    className,
    closeOnOutsideClick
}: React.PropsWithChildren<{
    isOpen: boolean;
    title: string;
    onPutAway: () => void;
    className?: string;
    closeOnOutsideClick?: boolean;
}>): React.ReactNode;

export function useDialog(
    initallyOpen?: boolean
): [
    BoundDialog: ({
        children
    }: React.PropsWithChildren<object & {aria: ReactModal.Aria}>) => React.ReactNode,
    open: () => void,
    close: () => void,
    showDialog: boolean
];
