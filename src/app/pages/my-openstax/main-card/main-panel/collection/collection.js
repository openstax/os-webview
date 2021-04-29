import React from 'react';
// import InstitutionSection from './institutions';
// import RoleSection from './role';
import AdoptedBooks from './adopted-books/adopted-books';
import './collection.scss';

export default function Collection({id, hidden}) {
    return (
        <section id={id} hidden={hidden}>
            <h2>My Collection</h2>
            <AdoptedBooks />
        </section>
    );
}
