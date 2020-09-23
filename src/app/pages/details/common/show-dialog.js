import shellBus from '~/components/shell/shell-bus';
import {pageWrapper} from '~/controllers/jsx-wrapper';

export function hideDialog() {
    shellBus.emit('hideDialog');
}

export default function showDialog({
    event, dialogTitle='', dialogContent, dialogContentArgs, dialogArgs={}
}) {
    const content = new(pageWrapper(dialogContent))(dialogContentArgs);

    shellBus.emit('showDialog', () => ({
        title: dialogTitle,
        content,
        ...dialogArgs
    }));
    event.stopPropagation();
    event.preventDefault();
}
