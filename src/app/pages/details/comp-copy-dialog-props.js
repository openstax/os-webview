import booksPromise from '~/models/books';
import shell from '~/components/shell/shell';
import settings from 'settings';
import RequestForm from './request-form/request-form';

const filteredBooksPromise = booksPromise
    .then((books) => books.filter((b) => b.comp_copy_available && b.salesforce_abbreviation));

function getCompCopyDialogProps(props, userStatusPromise) {
    const dialogProps = {
        title: props.prompt
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
    const userInfo = {};
    let salesforceTitle = '';
    let notAvailable = false;
    const formGetProps = () => Object.assign(
        {
            user: userInfo,
            salesforceTitle,
            notAvailable
        },
        props);

    dialogProps.content = new RequestForm(formGetProps, formHandlers);
    userStatusPromise.then((userStatus) => {
        Object.assign(userInfo, {
            firstName: userStatus.firstName,
            lastName: userStatus.lastName,
            email: userStatus.email
        });
        dialogProps.content.update();
    });
    filteredBooksPromise.then((books) => {
        const entry = books.find((b) => b.title === props.title);

        if (entry) {
            salesforceTitle = entry.salesforce_abbreviation;
            dialogProps.content.update();
        } else {
            notAvailable = true;
            dialogProps.content.update();
        }
    });

    return dialogProps;
}

export default getCompCopyDialogProps;
