import React from 'react';
import { useNavigate } from 'react-router-dom';
import './student-form.scss';

export default function StudentForm() {
    const navigate = useNavigate();
    const goBack = React.useCallback(
        () => navigate(-1),
        [navigate]
    );

    return (
        <div className="student-form text-content">
            Students don&apos;t need to fill out any forms to use our books. Access them free now!
            <div className="cta">
                <button className="btn" tabIndex="0" onClick={goBack}>Go back</button>
            </div>
        </div>
    );
}
