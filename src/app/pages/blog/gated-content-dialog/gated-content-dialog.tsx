import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import linkHelper from '~/helpers/link';
import useUserContext from '~/contexts/user';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import ContactInfo from '~/components/contact-info/contact-info';
import {RoleDropdown, Option} from '~/components/role-selector/role-selector';
import FormInput from '~/components/form-input/form-input';
import DropdownSelect from '~/components/select/drop-down/drop-down';
import useFormTarget from '~/components/form-target/form-target';
import type {ArticleData} from '../article/article';
import useBlogContext from '../blog-context';
import cn from 'classnames';
import settings from '~/helpers/window-settings';
import './gated-content-dialog.scss';

const formSubmitUrl = settings().gatedContentEndpoint;

export default function WaitForData({articleData}: {articleData?: ArticleData}) {
    return articleData?.gatedContent ? <GatedContentDialog /> : null;
}

function GatedContentDialog() {
    const [Dialog, open, close] = useDialog();
    const {userModel} = useUserContext();
    const [submitted, setSubmitted] = React.useState(false);

    React.useEffect(() => {
        if (userModel?.id || submitted) {
            close();
        } else {
            open();
        }
    }, [userModel, open, close, submitted]);

    return (
        <Dialog
            title="Thanks for reading the OpenStax blog."
            className="gated-content"
        >
            <GatedContentBody {...{submitted, setSubmitted}} />
        </Dialog>
    );
}

function GatedContentBody({
    submitted,
    setSubmitted
}: {
    submitted: boolean;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const loginLocation = new window.URL(linkHelper.loginLink());

    return (
        <div className="dialog-body">
            <div className="instructions">
                This post is exclusive. Please login or fill out the form to
                access the article.
            </div>
            <a
                className="btn secondary"
                href={loginLocation.href}
                data-local="true"
            >
                Login to my account
            </a>
            <GatedContentForm {...{submitted, setSubmitted}} />
        </div>
    );
}

function SubjectSelector() {
    const {subjectSnippet: data} = useBlogContext();
    const options = React.useMemo(
        () => data.map((obj) => ({
            label: obj.name,
            value: obj.name
        })),
        [data]
    );
    const [value, setValue] = React.useState<string>();
    const message = value ? '' : 'Please select one';

    return (
        <div className="form-input">
            <div className="control-group">
                <label className="field-label">Subject of interest</label>
                <DropdownSelect
                    name="subject"
                    required
                    options={options}
                    placeholder="Please select one"
                    onValueUpdate={setValue}
                />
                <div className="invalid-message">{message}</div>
            </div>
        </div>
    );
}

function GatedContentForm({
    submitted,
    setSubmitted
}: {
    submitted: boolean;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const afterSubmit = React.useCallback(
        () => setSubmitted(true),
        [setSubmitted]
    );

    const {onSubmit, FormTarget} = useFormTarget(afterSubmit);
    const [selectedRole, setSelectedRole] = React.useState<unknown>();

    return (
        <React.Fragment>
            <FormTarget />
            <form
                className={cn({submitted})}
                action={formSubmitUrl}
                onSubmit={onSubmit}
                target="form-target"
            >
                <ContactInfo>
                    <SubjectSelector />
                    <RoleSelector
                        value={selectedRole}
                        setValue={setSelectedRole}
                    />
                    {selectedRole === 'Faculty' && (
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
                    )}
                </ContactInfo>
                <button className="primary">Submit</button>
            </form>
        </React.Fragment>
    );
}

function RoleSelector({
    value,
    setValue
}: {
    value: unknown;
    setValue: React.Dispatch<unknown>;
}) {
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
                <RoleDropdown
                    options={roleOptions as Option[]}
                    setValue={setValue}
                    name="role"
                />
                <div className="invalid-message">{message}</div>
            </div>
        </div>
    );
}
