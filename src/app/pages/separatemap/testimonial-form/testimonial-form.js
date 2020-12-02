import React, {useState} from 'react';
import FormSelect from '~/components/form-select/form-select.jsx';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import booksPromise from '~/models/books';
import {useSalesforceLoadedState, salesforce} from '~/models/salesforce';
import './testimonial-form.css';

function Controls({book}) {
    return (
        <React.Fragment>
            <div class="control-group">
                <label class="field-label">Your testimonial</label>
                <textarea name="00N0B000006K1PC" rows="8" cols="80" required />
            </div>
            <input type="submit" />
        </React.Fragment>
    );
}

export default function TestimonialForm({email, school, firstName, lastName, afterSubmit}) {
    const [bookIsSelected, setBookIsSelected] = useState(false);
    const options = useDataFromPromise(booksPromise, [])
        .map((i) => ({
            label: i.title,
            value: i.salesforce_abbreviation
        }));
    const sfLoaded = useSalesforceLoadedState();

    function onSubmit(event) {
        const form = document.getElementById('form-response');

        function doAfterSubmitAndCleanup() {
            form.removeEventListener('load', doAfterSubmitAndCleanup);
            afterSubmit();
        }

        form.addEventListener('load', doAfterSubmitAndCleanup);
    }

    return (
        <div className="testimonial-form">
            <iframe
                name="form-response" id="form-response" class="hidden"
                src="" width="0" height="0" tabindex="-1"
            />
            <form
                accept-charset="UTF-8" class="form" target="form-response"
                action={salesforce.webtoleadUrl} method="post"
                onSubmit={onSubmit}
            >
                <input type="hidden" name="oid" value={salesforce.oid} />
                <input type="hidden" name="lead_source" value="Testimonial" />
                <input type="hidden" name="first_name" value={firstName} />
                <input type="hidden" name="last_name" value={lastName} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="00NU0000005VkYv" value={school} />
                <div class="book-selector">
                    <FormSelect
                        name="00NU00000053nzR"
                        selectAttributes={{
                            placeholder: 'Please select one',
                            onChange() {
                                setBookIsSelected(true);
                            }
                        }}
                        label="Book title" options={options} />
                </div>
                {bookIsSelected && <Controls />}
            </form>
        </div>
    );
}
