import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import GiveBeforeOnline from './give-before-online';
import GiveBeforePdf from './give-before-pdf';
import useDonationPopupData from './use-donation-popup-data';
import {isMobileDisplay} from '~/helpers/device';

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data = useDonationPopupData();

    const GiveDialog = React.useCallback(
        ({
            link,
            track,
            onDownload,
            variant
        }: {
            link: string;
            track?: string;
            onDownload?: (
                e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void;
            variant?: VariantOptions;
        }) => {
            const Variant = lookupVariant(variant) as typeof GiveBeforeOnline;

            return (
                <Dialog>
                    <Variant {...{link, track, close, data, onDownload}} />
                </Dialog>
            );
        },
        [close, data, Dialog]
    );

    return {
        GiveDialog,
        open,
        enabled: !data.hide_donation_popup
    };
}

export function useOpenGiveDialog() {
    const {GiveDialog, open, enabled} = useGiveDialog();
    const openGiveDialog = React.useCallback(
        (event: React.MouseEvent) => {
            if (enabled && !isMobileDisplay()) {
                event.preventDefault();
                open();
            }
        },
        [enabled, open]
    );

    return {GiveDialog, openGiveDialog};
}

export type VariantOptions = 'online' | undefined;
function lookupVariant(variant: VariantOptions) {
    if (variant === 'online') {
        return GiveBeforeOnline;
    }
    return GiveBeforePdf;
}
