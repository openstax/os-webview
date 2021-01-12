import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import DropdownJsx, {MenuItem} from './dropdown/dropdown';
import React, {useRef, useEffect} from 'react';
import categoryPromise from '~/models/subjectCategories';
import LoginMenu from './login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import './main-menu.css';

function SubjectsMenu() {
    const categories = useDataFromPromise(categoryPromise);

    if (!categories) {
        return (<li>Loading...</li>);
    }

    return (
        <DropdownJsx className="subjects-dropdown" label="Subjects">
            {
                categories.map((obj) =>
                    <MenuItem
                        key={obj.value}
                        label={obj.html.replace('View ', '')}
                        url={`/subjects/${obj.value}`}
                    />
                )
            }
        </DropdownJsx>
    );
}

export default function MainMenu({children}) {
    return (
        <div className="container">
            <span className="logo-wrapper">
                <span className="logo">
                    <a href="/" aria-label="Home Page">
                        <img className="logo-color" src="/images/logo.svg" alt="OpenStax logo" />
                        <img className="logo-white" src="/images/logo-white.svg" alt="OpenStax logo" />
                    </a>
                </span>

                <span className="logo-quote">Access. The future of education.</span>
            </span>

            <ul className="nav-menu main-menu no-bullets">
                <SubjectsMenu />
                <DropdownJsx className="technology-dropdown" label="Technology">
                    <MenuItem url="/openstax-tutor" label="OpenStax Tutor" />
                    <MenuItem url="/partners" label="OpenStax Tech Scout" />
                </DropdownJsx>
                <DropdownJsx className="what-we-do-dropdown" label="What we do">
                    <MenuItem url="/about" label="About Us" />
                    <MenuItem url="/team" label="Team" />
                    <MenuItem url="/research" label="Research" />
                    <MenuItem url="/institutional-partnership" label="Institutional Partnerships" />
                    <MenuItem url="/creator-fest" label="Creator Fest" />
                </DropdownJsx>
                <LoginMenu />
                <li className="give-button-item"><GiveButton /></li>
            </ul>
            {children}
        </div>
    );
}
