import React, {useState} from 'react';
import FormSelect from '~/components/form-select/form-select.jsx';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import booksPromise from '~/models/books';
import useSalesforceContext from '~/contexts/salesforce';
import './testimonial-form.scss';

function Controls() {
    return (
        <React.Fragment>
            <div className="control-group">
                <label className="field-label">Your testimonial</label>
                <textarea name="00N0B000006K1PC" rows="8" cols="80" required />
            </div>
            <input type="submit" />
        </React.Fragment>
    );
}

export default function TestimonialForm({email, school, company, firstName, lastName, uuid, afterSubmit}) {
    const [bookIsSelected, setBookIsSelected] = useState(false);
    const options = useDataFromPromise(booksPromise, [])
        .map((i) => ({
            label: i.title,
            value: i.salesforce_abbreviation
        }));
    const {oid, webtoleadUrl, debug, debugEmail} = useSalesforceContext();

    if (!webtoleadUrl) {
        return null;
    }

    function onSubmit() {
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
                name="form-response" id="form-response" className="hidden"
                src="" width="0" height="0" tabIndex="-1"
            />
            <form
                acceptCharset="UTF-8" className="form" target="form-response"
                action={webtoleadUrl} method="post"
                onSubmit={onSubmit}
            >
                {
                    debug &&
                        <React.Fragment>
                            <h1>DEBUG!</h1>
                            <input type="hidden" name="debug" value="1" />
                            <input type="hidden" name="debugEmail" value={debugEmail} />
                        </React.Fragment>
                }
                <input type="hidden" name="oid" value={oid} />
                <input type="hidden" name="lead_source" value="Testimonial" />
                <input type="hidden" name="first_name" value={firstName} />
                <input type="hidden" name="last_name" value={lastName} />
                <input type="hidden" name="00N6f00000FqlPu" value={uuid} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="00NU0000005VkYv" value={school} />
                <input type="hidden" name="company" value={company} />
                <div className="book-selector">
                    <FormSelect
                        name="00NU00000053nzR"
                        selectAttributes={{
                            placeholder: 'Please select one'
                        }}
                        onValueUpdate={(value) => setBookIsSelected(Boolean(value))}
                        label="Book title" options={options} />
                </div>
                {bookIsSelected && <Controls />}
            </form>
        </div>
    );
}
