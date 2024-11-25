import React from 'react';
import PartnerDetails from '../partner-details/partner-details';
import Dialog from '~/components/dialog/dialog';
import useDialogContext, {DialogContextProvider} from './dialog-context';
import {useNavigate, useLocation} from 'react-router-dom';
import type {LinkTexts, PartnerEntry} from './results';

export default function SelectedPartnerDialog({
    linkTexts,
    entries
}: {
    linkTexts: LinkTexts;
    entries: PartnerEntry[];
}) {
    const [partner, closePartner] = usePartnerFromLocation(entries);
    const detailData = {...partner, ...linkTexts};

    return (
        <DialogContextProvider contextValueParameters={partner}>
            <DialogInContext isOpen={Boolean(partner)} onPutAway={closePartner}>
                {Boolean(partner) && <PartnerDetails detailData={detailData} />}
            </DialogInContext>
        </DialogContextProvider>
    );
}

function usePartnerFromLocation(
    entries: PartnerEntry[]
): [PartnerEntry, () => void] {
    const {pathname, search} = useLocation();
    const partner = React.useMemo(() => {
        const paramKeys = Array.from(new window.URLSearchParams(search).keys());

        return entries.find((e) => paramKeys.includes(e.title)) as PartnerEntry;
    }, [entries, search]);
    const navigate = useNavigate();
    const closePartner = React.useCallback(
        () => navigate(pathname, {replace: true}),
        [pathname, navigate]
    );

    return [partner, closePartner];
}

function DialogInContext(dialogProps: Parameters<typeof Dialog>[0]) {
    const {title} = useDialogContext();

    return <Dialog title={title} {...dialogProps} />;
}
