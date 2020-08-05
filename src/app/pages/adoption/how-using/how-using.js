import React, {useState, useContext} from 'react';
import {LoadPageAfterSalesforce, salesforce} from '~/models/salesforce';
import FormInput from '~/components/form-input/form-input.jsx';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import {FormSubmitContext} from '~/components/salesforce-form/salesforce-form.jsx';
import './how-using.css';

function HowUsingBook({book, selectedValue, setSelectedValue}) {
    const sfOptions = salesforce.adoption(['adopted', 'recommended']);
    // Tricky: don't want a name at submit time, but need one for validation
    const name = selectedValue ? null : book.value;

    return (
        <FormRadioGroup label={`How are you using ${book.text}?`}
            options={sfOptions} selectedValue={selectedValue}
            required name
            setSelectedValue={setSelectedValue}
        />
    );
}

function HowManyStudents({book, value, setValue}) {
    function onChange({target}) {
        setValue(target.value);
    }

    return (
        <div>
            How many students are using {book.text} each semester?
            <div className="hint">Include sections taught by TAs that you oversee</div>
            <FormInput inputProps={{
                type: 'number',
                min: '1',
                max: '999',
                required: true,
                value,
                onChange
            }} />
        </div>
    );
}

function BothQuestionsForBook({book, isFirst}) {
    const [adoptionStatus, setAdoptionStatus] = useState();
    const [numberOfStudents, setNumberOfStudents] = useState();
    const bookBeingSubmitted = useContext(FormSubmitContext);

    return (
        <div>
            <HowUsingBook book={book} selectedValue={adoptionStatus} setSelectedValue={setAdoptionStatus} />
            <HowManyStudents book={book} value={numberOfStudents} setValue={setNumberOfStudents} />
            {
                book === bookBeingSubmitted &&
                    <React.Fragment>
                        <input type="hidden" name="Subject__c" value={book.value} />
                        <input type="hidden" name="Adoption_Status__c" value={adoptionStatus} />
                        <input type="hidden" name="Number_of_Students__c" value={numberOfStudents} />
                        <input type="hidden" name="First__c" value={isFirst} />
                    </React.Fragment>
            }
        </div>
    );
}

function HowUsing({selectedBooks}) {
    return (
        <div className="how-using">
            {
                selectedBooks.map((book, i) =>
                    <BothQuestionsForBook book={book} isFirst={i === 0} />
                )
            }
        </div>
    );
}

export default function HowUsingLoader(props) {
    return (
        <LoadPageAfterSalesforce Child={HowUsing} {...props} />
    );
}
