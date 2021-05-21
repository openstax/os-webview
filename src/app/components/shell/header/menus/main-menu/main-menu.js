import React from 'react';
import categoryPromise from '~/models/subjectCategories';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Dropdown, {MenuItem} from './dropdown/dropdown';
import LoginMenu from './login-menu';
import GiveButton from '../give-button/give-button';
import './main-menu.scss';

function SubjectsMenu() {
    const categories = useDataFromPromise(categoryPromise);

    if (!categories) {
        return (<li>Loading...</li>);
    }

    return (
        <Dropdown className="subjects-dropdown" label="Subjects">
            {
                categories.map((obj) =>
                    <MenuItem
                        key={obj.value}
                        label={obj.html.replace('View ', '')}
                        url={`/subjects/${obj.value}`}
                    />
                )
            }
        </Dropdown>
    );
}

export default function MainMenu() {
    return (
        <ul className="nav-menu main-menu no-bullets" role="menubar">
            <SubjectsMenu />
            <Dropdown className="technology-dropdown" label="Technology">
                <MenuItem url="/openstax-tutor" label="OpenStax Tutor" />
                <MenuItem url="/partners" label="OpenStax Tech Scout" />
            </Dropdown>
            <Dropdown className="what-we-do-dropdown" label="What we do">
                <MenuItem url="/about" label="About Us" />
                <MenuItem url="/team" label="Team" />
                <MenuItem url="/research" label="Research" />
                <MenuItem url="/institutional-partnership" label="Institutional Partnerships" />
                <MenuItem url="/general/openstax-ally-application" label="Technology Partnerships" />
            </Dropdown>
            <LoginMenu />
            <li className="give-button-item" role="presentation"><GiveButton /></li>
        </ul>
    );
}
