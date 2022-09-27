import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import linkHelper from '~/helpers/link';
import useUserContext from '~/contexts/user';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import ContactInfo from '~/components/contact-info/contact-info';
import {RoleDropdown} from '~/components/role-selector/role-selector';
import FormInput from '~/components/form-input/form-input';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import cn from 'classnames';
import './gated-content-dialog.scss';

function SubjectSelector() {
    const data = useDataFromSlug('snippets/subjects');
    const options = React.useMemo(
        () => camelCaseKeys(data || [])
            .map((obj) => ({label: obj.name, value: obj.name})),
        [data]
    );
    const [value, setValue] = React.useState();
    const message = value ? '' : 'Please select one';

    return (
        <div className="form-input">
            <div className="control-group">
                <label className="field-label">Subject of interest</label>
                <DropdownSelect
                    name="subject" required
                    options={options}
                    placeholder="Please select one"
                    onValueUpdate={setValue}
                />
                <div className="invalid-message">{message}</div>
            </div>
        </div>
    );
}

function RoleSelector({value, setValue}) {
    const roleData = useDataFromSlug('snippets/roles');
    const roleOptions = React.useMemo(
        () => camelCaseKeys(roleData) || [],
        [roleData]
    );
    const message = value ? '' : 'Please select one';

    return (
        <div className="form-input">
            <div className="control-group">
                <label className="field-label">Your role</label>
                <RoleDropdown options={roleOptions} setValue={setValue} />
                <div className="invalid-message">{message}</div>
            </div>
        </div>
    );
}

function GatedContentForm() {
    const [submitted, setSubmitted] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState();

    return (
        <form className={cn({submitted})}>
            <ContactInfo>
                <SubjectSelector />
                <RoleSelector value={selectedRole} setValue={setSelectedRole} />
                {
                    selectedRole === 'Faculty' &&
                        <FormInput
                            label="Number of students you teach"
                            inputProps={{
                                type: 'number',
                                name: 'num_students',
                                required: true,
                                min: 1,
                                max: 999
                            }}
                        />
                }
            </ContactInfo>
            <button className="primary" onClick={() => setSubmitted(true)}>Submit</button>
        </form>
    );
}

function GatedContentBody() {
    const loginLocation = new window.URL(linkHelper.loginLink());

    return (
        <div className="dialog-body">
            <div className="instructions">
                This post is exclusive. Please login or fill out the form to
                access the article.
            </div>
            <a className="btn secondary" href={loginLocation.href} data-local="true">
                Login to my account
            </a>
            <GatedContentForm />
        </div>
    );
}

function GatedContentDialog() {
    const [Dialog, open, close] = useDialog();
    const {userModel} = useUserContext();

    React.useEffect(() => {
        if (userModel?.id) {
            close();
        } else {
            open();
        }
    }, [userModel, open, close]);

    return (
        <Dialog
            title="Thanks for reading the OpenStax blog."
            className="gated-content"
        >
            <GatedContentBody />
        </Dialog>
    );
}

export default function WaitForData({articleData}) {
    return (articleData?.gated_content ? <GatedContentDialog /> : null);
}
