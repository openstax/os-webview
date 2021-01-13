import React, {useState, useEffect, useRef} from 'react';
import managedInvalidMessage from './InvalidMessage.js';

function OtherErrorInput() {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return (
        <div className="other-group">
            <InvalidMessage />
            <input
                type="text"
                name="error_type_other"
                maxLength="250"
                ref={inputRef}
                onChange={updateInvalidMessage}
                required
            />
        </div>
    );
}

export default function ErrorTypeSelector() {
    const errorTypes = [
        'Broken link',
        'Incorrect answer, calculation, or solution',
        'General/pedagogical suggestion or question',
        'Other factual inaccuracy in content',
        'Typo',
        'Other'
    ];
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const [selectedError, updateSelectedError] = useState();
    const helpBoxVisible = selectedError === 'Other' ? 'visible' : 'not-visible';

    function onChange(event) {
        updateSelectedError(event.target.value);
        updateInvalidMessage();
    }

    return (
        <React.Fragment>
            <div className="question">Select the type of error below.</div>
            <div className="radio-columns">
                <InvalidMessage />
                {
                    errorTypes.map((eType) =>
                        <label key={eType}>
                            <input
                                type="radio" name="error_type" value={eType}
                                ref={inputRef}
                                onChange={onChange}
                                required
                            />
                            <span className="label-text">{eType}</span>
                            {
                                (eType === 'Other' && selectedError === 'Other') && (
                                    <OtherErrorInput />
                                )
                            }
                        </label>
                    )
                }
            </div>
            <div className={`helpbox ${helpBoxVisible}`}>
                <span>Need help logging in or have general questions? Contact Support at </span>
                <a href="mailto:support@openstax.org">support@openstax.org</a>.
            </div>
        </React.Fragment>
    );
}
