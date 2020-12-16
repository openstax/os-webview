import React, {useState, useRef} from 'react';
import {RawHTML, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import FormInput from '~/components/form-input/form-input.jsx';
import ModuleList from './module-list';
import {useUserStatus} from '../hooks';
import showDialog, {hideDialog} from '~/helpers/show-dialog';
import {cmsPost} from '~/models/cmsFetch';
import cn from 'classnames';
import './customization-form.css';

const thankYou = 'Thank you &mdash; your request has been sent to the OpenStax team.';

function Feedback({data, nextSteps}) {
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
            <Feedback data={submitted} nextSteps={model.customizationFormNextSteps} />
        );
    }

    return (
        <form className={cn('customization-form', {showErrors})} ref={ref}>
            <div className="top">
                <div className="description">{model.customizationFormSubheading}</div>
                <div className="inputs">
                    <RawHTML className="disclaimer" html={model.customizationFormDisclaimer} />
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
