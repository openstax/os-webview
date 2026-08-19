import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import GiveBeforePdf from './give-before-pdf';
import GiveBeforeOther from './give-before-other';
import ContentWarning, {checkWarningCookie} from './content-warning';
import useDonationPopupData from './use-donation-popup-data';
import {isMobileDisplay} from '~/helpers/device';

// Frequency cap shared across every mount point, matching takeover-dialog.
const RECENT_DELTA_MS = 16 * 60 * 60 * 1000; // 16 hours
const LS_KEY = 'giveDialogLastDisplay';

function shownRecently() {
    try {
        const lastShown = Number(window.localStorage.getItem(LS_KEY));

        return Date.now() - lastShown < RECENT_DELTA_MS;
    } catch {
        return false;
    }
}

function markShown() {
    try {
        window.localStorage.setItem(LS_KEY, String(Date.now()));
    } catch {
        // Storage unavailable; continue opening the dialog.
    }
    window.dataLayer ||= [];
    window.dataLayer.push({event: 'giveDialogImpression'});
}

// openIfNotRecent and lookupVariant must agree here, or the decision to open
// disagrees with the dialog that renders.
function needsContentWarning(warning?: string, id?: string) {
    return Boolean(warning && id && !checkWarningCookie(id));
}

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
            id,
            downloadSource
        }: {
            link: string;
            track?: string;
            onDownload?: React.MouseEventHandler;
            variant?: VariantValue;
            warning?: string;
            id?: string;
            downloadSource?: string;
        }) => {
            const variantParams = {link, track, close, data, onDownload, variant, warning, id, downloadSource};
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

    // Returns whether the dialog opened, so callers know to suppress the
    // default link navigation. Content warnings answer to their own cookie,
    // not the donation cap, and are not donation impressions.
    const openIfNotRecent = React.useCallback((warning?: string, id?: string) => {
        if (needsContentWarning(warning, id)) {
            open();
            return true;
        }
        if (shownRecently()) {
            return false;
        }
        markShown();
        open();
        return true;
    }, [open]);

    return {
        GiveDialog,
        open: openIfNotRecent,
        enabled: !data?.hide_donation_popup
    };
}

export function useOpenGiveDialog(warning?: string, id?: string) {
    const {GiveDialog, open, enabled} = useGiveDialog();
    const openGiveDialog = React.useCallback(
        (event: React.MouseEvent) => {
            if (enabled && !isMobileDisplay() && open(warning, id)) {
                event.preventDefault();
            }
        },
        [enabled, open, warning, id]
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

    if (needsContentWarning(warning, id)) {
        return [ContentWarning, variantParams as Parameters<typeof ContentWarning>];
    }
    if (variant !== undefined) {
        return [GiveBeforeOther, variantParams as Parameters<typeof GiveBeforeOther>];
    }
    return [GiveBeforePdf, variantParams as Parameters<typeof GiveBeforePdf>];
}
