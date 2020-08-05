import React from 'react';
import './student-form.css';

export default function StudentForm() {
    function onClick() {
        history.back();
    }

    return (
        <div className="student-form text-content">
            Students don't need to fill out any forms to use our books. Access them free now!
            <div class="cta">
                <button class="btn" tabindex="0" onClick={onClick}>Go back</button>
            </div>
        </div>
    );
}
