import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import GiveBeforePdf from './give-before-pdf';
import GiveBeforeOther from './give-before-other';
import ContentWarning, {checkWarningCookie} from './content-warning';
import useDonationPopupData from './use-donation-popup-data';
import {isMobileDisplay} from '~/helpers/device';

export type VariantValue =
    | 'content-warning'
    | 'Instructor resource'
    | 'Student resource'
    | 'View online'
    | 'K12 resource'
    | '? resource';

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data = useDonationPopupData();

    const GiveDialog = React.useCallback(
        ({
            link,
            track,
            onDownload,
            variant,
            warning='',
            id
        }: {
            link: string;
            track?: string;
            onDownload?: (e: React.MouseEvent) => void;
            variant?: VariantValue;
            warning?: string;
            id?: string;
        }) => {
            const variantParams = {link, track, close, data, onDownload, variant, warning, id};
            const [Variant, typedVariantParams] = lookupVariant(warning, variantParams);
            const aria =
                Variant === GiveBeforePdf
                    ? {labelledby: 'dialog-heading'}
                    : {label: 'Before you go there'};

            return (
                <Dialog aria={aria}>
                    <Variant {...typedVariantParams} />
                </Dialog>
            );
        },
        [close, data, Dialog]
    );

    return {
        GiveDialog,
        open,
        enabled: !data?.hide_donation_popup
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

// This was a little bit clever, so typing became a problem
function lookupVariant(warning: string, variantParams: {
    id?: string;
    variant?: string;
}): [
    Variant: (p: any) => React.JSX.Element, // eslint-disable-line @typescript-eslint/no-explicit-any
    p: object
] {
    const {id, variant} = variantParams;

    if (warning && id && !checkWarningCookie(id)) {
        return [ContentWarning, variantParams as Parameters<typeof ContentWarning>];
    }
    if (variant !== undefined) {
        return [GiveBeforeOther, variantParams as Parameters<typeof GiveBeforeOther>];
    }
    return [GiveBeforePdf, variantParams as Parameters<typeof GiveBeforePdf>];
}
