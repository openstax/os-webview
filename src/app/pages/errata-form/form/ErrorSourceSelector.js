import React, {useState, useRef} from 'react';
import managedInvalidMessage from './InvalidMessage.js';
import getFields from '~/models/errata-fields';

const resourcePromise = getFields('resources')
    .then((resources) => resources.map((entry) => entry.field));

function OtherSourceInput() {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return (
        <div className="other-group">
            <InvalidMessage />
            <input
                type="text"
                name="resource_other" maxLength="250"
                ref={inputRef} onChange={updateInvalidMessage}
                required
            />
        </div>
    );
}

export default function ErrorSourceSelector({initialSource}) {
    const subnotes = {'Textbook': 'includes print, PDF, and web view'};
    const [sourceTypes, updateSourceTypes] = useState([]);
    const [selectedSource, updateSelectedSource] = useState(initialSource);
    const radioRef = useRef();
    const [RadioInvalidMessage, updateRadioInvalidMessage] = managedInvalidMessage(radioRef);

    resourcePromise.then(updateSourceTypes).then(updateRadioInvalidMessage);
    function onChange(event) {
        updateSelectedSource(event.target.value);
        updateRadioInvalidMessage();
    }
    function Subnote({sType}) {
        return (
            <div className="label-text">
                {sType}
                {
                    (sType in subnotes) &&
                    <div className="indented subnote">{subnotes[sType]}</div>
                }
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="question">In which source did you find this error?</div>
            <div className="radio-columns">
                <RadioInvalidMessage />
                {
                    sourceTypes.map((sType, index) => (
                        <label key={sType}>
                            <input
                                type="radio" name="resource"
                                value={sType}
                                defaultChecked={selectedSource === sType ? '' : null}
                                ref={index === 0 ? radioRef : null}
                                onChange={onChange}
                                required
                            />
                            <Subnote sType={sType} />
                            {
                                (sType === 'Other' && selectedSource === 'Other') &&
                                <OtherSourceInput />
                            }
                        </label>
                    ))
                }
            </div>
        </React.Fragment>
    );
}
