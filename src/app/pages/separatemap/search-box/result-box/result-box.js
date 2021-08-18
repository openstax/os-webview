import React, {useRef, useLayoutEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faQuoteLeft} from '@fortawesome/free-solid-svg-icons/faQuoteLeft';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useUserContext from '~/contexts/user';
import TestimonialForm from '../../testimonial-form/testimonial-form';
import Dialog from '~/components/dialog/dialog';
import './result-box.scss';

const format = new window.Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format;

function Testimonial({testimonial}) {
    return (
        <div className="testimonial-box">
            <div className="quote">
                <FontAwesomeIcon icon={faQuoteLeft} className="quotation-mark" />
                {testimonial.text}
            </div>
            <div className="attribution">
                <div className="name">{testimonial.name}</div>
                {
                    testimonial.position &&
                        <div className="position">{testimonial.position}</div>
                }
            </div>
        </div>
    );
}

function useFormParameters(hideDialog) {
    const {userModel} = useUserContext();

    if (!userModel.accountsModel) {
        return null;
    }

    const {accountsModel: info} = userModel;

    return {
        role: info.self_reported_role,
        email: (info.contact_infos || [])
            .filter((i) => i.is_verified)
            .reduce((a, b) => (a.is_guessed_preferred ? a : b), {})
            .value,
        school: info.self_reported_school,
        firstName: info.first_name,
        lastName: info.last_name,
        afterSubmit: hideDialog
    };
}

function SchoolDetails({model}) {
    const [
        savingsTotal, savingsThisYear, testimonial
    ] = [
        format(model.fields.all_time_savings),
        format(model.fields.current_year_savings),
        model.testimonial
    ];
    const [isOpen, toggle] = useToggle();
    const formParameters = useFormParameters(toggle);

    function showTestimonialForm(event) {
        event.preventDefault();
        toggle();
    }

    return (
        <div className="school-details">
            <div className="savings-box">
                <div className="savings-header">Student savings</div>
                <div className="this-year">This year: {savingsThisYear}</div>
                <div className="cumulative">Cumulative: {savingsTotal}</div>
            </div>
            {testimonial && <Testimonial testimonial={testimonial} />}
            {
                formParameters &&
                    <a href="/" className="submit-testimonial go-to" onClick={showTestimonialForm}>
                        Submit your testimonial
                    </a>
            }
            <Dialog
                isOpen={isOpen} onPutAway={toggle}
                title="Submit your testimonial"
            >
                <TestimonialForm {...formParameters} />
            </Dialog>
        </div>
    );
}

export default function ResultBox({model, theOpenOne, setTheOpenOne}) {
    const ref = useRef();
    const [name, location] = [model.fields.name, model.cityState];
    const isOpen = theOpenOne === model;

    function toggle() {
        setTheOpenOne(isOpen ? null : model);
    }

    useLayoutEffect(() => {
        if (isOpen) {
            ref.current.scrollIntoView({block: 'nearest', behavior: 'smooth'});
        }
    });

    return (
        <div className="result-box" ref={ref}>
            <div
                className="toggle-details" role="switch" aria-checked={isOpen}
                onClick={toggle}
            >
                <div className="school-info">
                    <h2>{name}</h2>
                    <div>{location}</div>
                </div>
                <div className="toggle-indicator">
                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                </div>
            </div>
            {isOpen && <SchoolDetails model={model} />}
        </div>
    );
}
