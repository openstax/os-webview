import shell from '~/components/shell/shell';
import RequestForm from './request-form/request-form';

function compCopyDialogProps(getProps) {
    const dialogProps = {
        title: 'Request your complimentary iBooks download'
    };
    const setAltTitle = () => {
        dialogProps.htmlTitle = '<span class="fa fa-check"></span>';
        dialogProps.customClass = 'request-comp-copy-dialog';
        shell.dialog.update();
    };
    const formHandlers = {
        done: () => shell.hideDialog(),
        showConfirmation: setAltTitle
    };

    dialogProps.content = new RequestForm(getProps, formHandlers);
    return dialogProps;
}

export default compCopyDialogProps;
