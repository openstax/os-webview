import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Dropdown from './dropdown/dropdown';
import React, {useRef, useEffect} from 'react';
import categoryPromise from '~/models/subjectCategories';
import attachLoginMenu from './login-menu/login-menu';
import useGiveToday from '~/models/give-today';
import './main-menu.css';

function SubjectsMenu() {
    const categories = useDataFromPromise(categoryPromise);

    if (!categories) {
        return (<li>Loading...</li>);
    }

    const dd = new Dropdown({
        dropdownLabel: 'Subjects',
        items: categories.map((obj) => ({
            url: `/subjects/${obj.value}`,
            label: obj.html.replace('View ', '')
        }))
    });

    return (
        <SuperbItem Tag="li" className="subjects-dropdown" component={dd} />
    );
}

function GiveButton() {
    const giveData = useGiveToday();

    if (!giveData.showButton) {
        return null;
    }

    return (
        <li><a href={giveData.give_link} className="btn medium">Give</a></li>
    );
}

function MainMenu() {
    const technologyDropdown = new Dropdown({
        dropdownLabel: 'Technology',
        items: [
            {url: '/openstax-tutor', label: 'OpenStax Tutor'},
            {url: '/rover-by-openstax', label: 'Rover by OpenStax'},
            {url: '/partners', label: 'OpenStax Tech Scout'}
        ]
    });
    const whatWeDoDropdown = new Dropdown({
        dropdownLabel: 'What we do',
        items: [
            {url: '/about', label: 'About Us'},
            {url: '/team', label: 'Team'},
            {url: '/research', label: 'Research'},
            {url: '/institutional-partnership', label: 'Institutional Partnerships'},
            {url: '/creator-fest', label: 'Creator Fest'}
        ]
    });
    const loginMenuRef = useRef();

    useEffect(() => {
        attachLoginMenu(loginMenuRef.current);
    }, []);

    return (
        <React.Fragment>
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
                <SuperbItem Tag="li" className="technology-dropdown" component={technologyDropdown} />
                <SuperbItem Tag="li" className="what-we-do-dropdown" component={whatWeDoDropdown} />
                <li className="login-menu" ref={loginMenuRef} />
                <GiveButton />
            </ul>
            <button className="expand" aria-haspopup="true" aria-label="Toggle Meta Navigation Menu" tabindex="0">
                <span></span>
            </button>
        </React.Fragment>
    );
}

const view = {
    classes: ['container']
};

export default pageWrapper(MainMenu, view);
