import type {TrackedMouseEvent} from '~/components/shell/router-helpers/useLinkHandler';

type UseGiveDialogTypes = {
    GiveDialog: ({
        link,
        onDownload,
        variant
    }: {
        link: string;
        onDownload?: (event: TrackedMouseEvent) => void;
        variant?: string;
    }) => React.JSX.Element;
    open: () => null;
    enabled: boolean;
};

export default function useGiveDialog(): UseGiveDialogTypes;
