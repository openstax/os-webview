import React, {useState} from 'react';
import managedInvalidMessage from './InvalidMessage.jsx';
import getFields from '~/models/errata-fields';

const resourcePromise = getFields('resources')
    .then((resources) => resources.map((entry) => entry.field));

function OtherSourceInput() {
    const inputRef = React.createRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return (
        <div className="other-group">
            <InvalidMessage />
            <input type="text"
             name="resource_other" maxLength="250"
             ref={inputRef} onChange={updateInvalidMessage}
             required
            />
        </div>
    );
}

export default function ErrorSourceSelector({initialSource}) {
    const isTutor = false;
    const subnotes = {'Textbook': 'includes print, PDF, and web view'};
    const [sourceTypes, updateSourceTypes] = useState([]);
    const [selectedSource, updateSelectedSource] = useState(initialSource);
    const radioRef = React.createRef();
    const [RadioInvalidMessage, updateRadioInvalidMessage] = managedInvalidMessage(radioRef);

    resourcePromise.then(updateSourceTypes).then(updateRadioInvalidMessage);
    function onChange(event) {
        updateSelectedSource(event.target.value);
        updateRadioInvalidMessage();
    }

    return [
        <div className="question" key="1">In which source did you find this error?</div>,
        <div className="radio-columns" key="2">
            <RadioInvalidMessage />
            {
                sourceTypes.map((sType, index) => (
                    <label key={sType}>
                        <input type="radio" name="resource"
                         value={sType}
                         defaultChecked={selectedSource === sType ? '' : null}
                         ref={index === 0 ? radioRef : null}
                         onChange={onChange}
                         required />
                        <div className="label-text">
                            {sType}
                            {
                                (sType in subnotes) &&
                                <div className="indented subnote">{subnotes[sType]}</div>
                            }
                        </div>
                        {
                            (sType === 'Other' && selectedSource === 'Other') &&
                            <OtherSourceInput />
                        }
                    </label>
                ))
            }
        </div>
    ];
}
