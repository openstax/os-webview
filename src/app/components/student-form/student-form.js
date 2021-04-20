import React from 'react';
import './student-form.scss';

export default function StudentForm() {
    function onClick() {
        history.back();
    }

    return (
        <div className="student-form text-content">
            Students don&apos;t need to fill out any forms to use our books. Access them free now!
            <div className="cta">
                <button className="btn" tabIndex="0" onClick={onClick}>Go back</button>
            </div>
        </div>
    );
}
