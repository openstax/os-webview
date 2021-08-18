import React, {useState, useEffect, useRef} from 'react';
import useUserContext from '~/contexts/user';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';
import {cmsPost} from '~/models/cmsFetch';

function useAdoptions(accountId) {
    const [adoptions, setAdoptions] = useState([]);

    useEffect(() => {
        if (accountId) {
            fetchFromCMS(`salesforce/renewal/${accountId}/`).then(setAdoptions);
        }
    }, [accountId]);

    return adoptions;
}

function BookCheckbox({info}) {
    return (
        <div className="control-group">
            <label>
                <input type="checkbox" name={info.id} value={info.yearly_students} />
                {info.book_name}
            </label>
        </div>
    );
}

async function submitForm(formRef, accountId) {
    for (const cb of formRef.current.querySelectorAll('[type=checkbox]')) {
        const students = cb.checked ? cb.value : 0;

        await cmsPost(`salesforce/renewal/${accountId}/`, {
            // eslint-disable-next-line camelcase
            confirmed_yearly_students: students,
            id: cb.name
        });
    }
}

export default function useAdoptionMicrosurveyContent() {
    const {userModel} = useUserContext();
    const {first_name: name, id: accountId} = userModel || {};
    const adoptions = useAdoptions(accountId);
    const ready = adoptions.length > 0;
    const ref = useRef();

    function AdoptionContent({onDone}) {
        function onSubmit() {
            submitForm(ref, accountId);
            onDone();
        }

        return (
            <div className="microsurvey-content" ref={ref}>
                <h1>
                    Hi, {name}. Are you still using these books?
                    Check all that apply.
                </h1>
                {adoptions.map((info) => <BookCheckbox key={info.id} info={info} />)}
                <button onClick={onSubmit}>Submit</button>
            </div>
        );
    }

    return [ready, AdoptionContent];
}
