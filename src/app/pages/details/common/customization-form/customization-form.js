import React, {useState, useRef} from 'react';
import {RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import FormInput from '~/components/form-input/form-input.jsx';
import ModuleList from './module-list';
import {useUserStatus} from '../hooks';
import showDialog, {hideDialog} from '../show-dialog';
import {cmsPost} from '~/models/cmsFetch';
import cn from 'classnames';
import './customization-form.css';

// This stuff will come from the CMS
const description = `
    Please fill out the form and select the modules (up to 10) that you want to
    customize with Google Docs. All form fields are required.
`;
const disclaimer = `
    <h2>Disclaimer</h2>
    <p>The following features and functionality are not available to
    teachers and students using Google Docs customized content:
    </p>
    <ul>
        <li>
            <b>Errata updates.</b> OpenStax webview is updated at least twice
            yearly. Customized Google Docs will not receive these content updates.
        </li>
        <li>
            <b>Access to study tools.</b> OpenStax webview has in-book search,
            highlighting, study guides, and more available for free. This
            functionality will not be available in Google Docs versions.
        </li>
        <li>
            <b>Formatting.</b> Print books and webview have a specific design and
            structure format developed for those platforms. These functionalities
            are not available in the Google Docs versions.
        </li>
    </ul>
`;
const thankYou = 'Thank you &mdash; your request has been sent to the OpenStax team.';
const nextSteps = `
    <h2>Next Steps</h2>
    <ol>
        <li>Within two business days, you will receive an email for each module
        that you have requested access to customize.</li>
        <li>The link provided in the email will be y our own copy of the Google
        Doc that OpenStax has generated for you.</li>
        <li>Once you have accessed the document you can make the changes you
        desire and share with your students. We recommend using the "Publish to
        the Web" functionality under the File menu for sharing with students.</li>
    </ol>
`;

function Feedback({data}) {
    return (
        <div className="customization-form">
            <div className="top">
                <RawHTML className="description" html={thankYou} />
                <RawHTML className="next-steps" html={nextSteps} />
                <div className="module-list">
                    <h2>Modules Requested</h2>
                    {data.map((html) => <RawHTML html={html} key={html} />)}
                </div>
            </div>
            <div className="bottom">
                <button type="button" className="primary" onClick={hideDialog}>
                    Close
                </button>
            </div>
        </div>
    );
}

function compareFields(a, b) {
    if (a[0] === b[0]) {
        return compareFields(a.slice(1), b.slice(1));
    }
    return a[0].localeCompare(b[0], 'en', {numeric: true}) || a[0].localeCompare(b[0]);
}

function compareSlugs(a, b) {
    return compareFields(a[0].split('-'), b[0].split('-'));
}

function useSelectedModulesTracker(maxItems=10) {
    const itemsRef = useRef(new Map());
    const items = itemsRef.current;
    const [size, setSize] = useState(0);

    return {
        get isEmpty() {
            return items.size === 0;
        },
        get isFull() {
            return items.size >= maxItems;
        },
        add(slug, html) {
            items.set(slug, html);
            setSize(items.size);
        },
        remove(slug) {
            items.delete(slug);
            setSize(items.size);
        },
        get html() {
            return Array.from(items.entries()).sort(compareSlugs).map((e) => e[1]);
        },
        get countMessage() {
            return `${size} of ${maxItems} selected`;
        }
    };
}

function payloadFromForm(form) {
    const fd = new FormData(form);
    const data = Array.from(fd.entries());

    return data.reduce((obj, [key, val]) => {
        if (key === 'module') {
            obj.modules.push(val);
        } else {
            obj[key] = val;
        }
        return obj;
    }, {modules: []});
}

function markInvalids(form) {
    const invalids = form.querySelectorAll(':invalid');

    return invalids.length;
}

export default function CustomizationForm({model}) {
    const [submitted, setSubmitted] = useState(false);
    const [showErrors, toggleShowErrors] = useToggle(false);
    const selectedModules = useSelectedModulesTracker();
    const ref = useRef();

    function doSubmit(event) {
        event.preventDefault();
        if (markInvalids(ref.current) || selectedModules.isEmpty) {
            toggleShowErrors(true);
            return;
        }
        cmsPost('customize', payloadFromForm(ref.current))
            .then(
                (response) => {
                    setSubmitted(selectedModules.html);
                },
                (err) => {
                    console.warn('OOPS! (going to feedback anyway)', err);
                    setSubmitted(selectedModules.html);
                }
            );
    }

    if (submitted) {
        return (
            <Feedback data={submitted} />
        );
    }

    return (
        <form className={cn('customization-form', {showErrors})} ref={ref}>
            <div className="top">
                <div className="description">{description}</div>
                <div className="inputs">
                    <RawHTML className="disclaimer" html={disclaimer} />
                    <FormInput
                        label="Google Account email"
                        inputProps={{
                            type: 'email',
                            name: 'email',
                            required: true,
                            autocomplete: 'email'
                        }}
                    />
                    <FormInput
                        label="How many students do you have in the current or upcoming semester?"
                        inputProps={{
                            type: 'number',
                            name: 'num_students',
                            min: '1',
                            max: '999',
                            required: true
                        }}
                    />
                    <FormInput
                        label="Why do you want or need to customize the OpenStax content?"
                        inputProps={{
                            maxlength: '500',
                            required: true,
                            name: 'reason',
                            Tag: 'textarea'
                        }}
                    />
                </div>
                <div className="modules">
                    <h2>Customizable modules</h2>
                    <p>
                        You may select up to 10 modules to customize<br />
                        {selectedModules.countMessage}
                    </p>
                    {
                        selectedModules.isEmpty &&
                            <div className="invalid-message">
                                You have not selected any modules.
                            </div>
                    }
                    <ModuleList model={model} selectedModules={selectedModules} />
                </div>
            </div>
            <div className="bottom">
                <input type="submit" onClick={doSubmit} />
            </div>
        </form>
    );
}
