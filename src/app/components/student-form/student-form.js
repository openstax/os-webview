import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import './student-form.scss';

export default function StudentForm() {
    const navigate = useNavigate();
    const goBack = React.useCallback(
        () => navigate(-1),
        [navigate]
    );

    return (
        <div className="student-form text-content">
            <FormattedMessage id="student-form:message" />
            <div className="cta">
                <button className="btn" tabIndex="0" onClick={goBack}>
                    <FormattedMessage id="student-form:go-back" />
                </button>
            </div>
        </div>
    );
}
