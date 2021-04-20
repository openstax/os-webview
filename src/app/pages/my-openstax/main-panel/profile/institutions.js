import React from 'react';
import { AddButton, randomColor } from '../common';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import InstitutionForm from './institution-form/institution-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUniversity} from '@fortawesome/free-solid-svg-icons/faUniversity';
import { useStoreon } from 'storeon/preact';
import './institutions.scss';

function preventAnd(fn) {
    return (event) => {
        event.preventDefault();
        fn();
    };
}

function AddInstitution() {
    const [Dialog, open, close] = useDialog();

    return (
        <React.Fragment>
            <Dialog title='Add new institution'>
                <InstitutionForm close={close} />
            </Dialog>
            <AddButton label='Add an institution' onClick={preventAnd(open)} />
        </React.Fragment>
    );
}

function Book({ data }) {
    const { books } = useStoreon('books');
    const foundEntry = books.find((entry) => entry.value === data.abbreviation);

    if (!foundEntry) {
        return null;
    }
    return (
        <div className='adopted-book card'>
            <img className='cover' src={foundEntry.coverUrl} alt={foundEntry.label} />
            <a className='btn primary' href='/book'>View book</a>
            <a className='btn' href='/resources'>Resources</a>
        </div>
    );
}

function Institution({ school }) {
    const [Dialog, open, close] = useDialog();

    return (
        <div className='institution'>
            <div className='icon-and-name'>
                <span className={`icon ${randomColor()}`}>
                    <FontAwesomeIcon icon={faUniversity} />
                </span>
                <span className='name'>
                    {school.name}
                </span>
            </div>
            <Dialog title='Edit institution'>
                <InstitutionForm school={school} close={close} />
            </Dialog>
            <a className='edit-link' href='#edit' onClick={preventAnd(open)}>Edit</a>
        </div>
    );
}

function AdoptionsForInstitution({ adoptions }) {
    const school = {
        id: adoptions.schoolId,
        name: adoptions.name
    };

    return (
        <div className='card'>
            <Institution school={school} />
            <div className='books'>
                {adoptions.books.map((book) => <Book data={book} key={book.opportunityId} />)}
            </div>
        </div>
    );
}

function CurrentInstitutions() {
    const { adoptions } = useStoreon('adoptions');

    if (adoptions.length === 0) {
        return null;
    }

    return (
        adoptions.map((adoptionsForSchool) =>
            <AdoptionsForInstitution
                adoptions={adoptionsForSchool}
                key={adoptionsForSchool.id}
            />
        )
    );
}

export default function Institutions() {
    return (
        <section>
            <h3>Current institutions</h3>
            <div className='institution-cards'>
                <CurrentInstitutions />
                <AddInstitution />
            </div>
        </section>
    );
}
