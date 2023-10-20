import React from 'react';

export default function Dialog({
    isOpen,
    title,
    onPutAway,
    children,
    className,
    closeOnOutsideClick = false
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
    }: React.PropsWithChildren<object>) => React.ReactNode,
    open: () => void,
    close: () => void,
    showDialog: boolean
];
