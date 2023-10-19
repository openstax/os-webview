import type {TrackedMouseEvent} from '~/components/shell/router-helpers/useLinkHandler';

type UseGiveDialogTypes = {
    GiveDialog: ({
        link,
        onDownload
    }: {
        link: string;
        onDownload?: (event: TrackedMouseEvent) => void;
    }) => React.JSX.Element;
    open: () => null;
    enabled: boolean;
};

export default function useGiveDialog(): UseGiveDialogTypes;
