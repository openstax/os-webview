import React, {useState, useRef} from 'react';
import useErrataFormContext from '../errata-form-context';
import managedInvalidMessage from './InvalidMessage.js';
import getFields from '~/models/errata-fields';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};

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

const subnotes = {'Textbook': 'includes print, PDF, and web view'};

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

function LabeledButton({selectedSource, sType, onChange, radioRef}) {
    const checked = selectedSource === sType;
    const showOtherInput = checked && selectedSource === 'Other';

    return (
        <label>
            <input
                type="radio" name="resource"
                value={sType}
                defaultChecked={checked}
                ref={radioRef}
                onChange={onChange}
                required
            />
            <Subnote sType={sType} />
            {showOtherInput && <OtherSourceInput />}
        </label>
    );
}

function useSourceTypes() {
    const {searchParams} = useErrataFormContext();
    const source = searchParams.get('source');
    const initialSource = source && sourceNames[source.toLowerCase()];
    const [sourceTypes, updateSourceTypes] = useState([]);
    const [selectedSource, updateSelectedSource] = useState(initialSource);
    const onChange = React.useCallback(
        ({target: {value}}) => updateSelectedSource(value),
        []
    );

    React.useEffect(() => {
        resourcePromise.then(updateSourceTypes);
    }, []);

    return {sourceTypes, selectedSource, onChange};
}

export default function ErrorSourceSelector() {
    const radioRef = useRef();
    const {sourceTypes, onChange, selectedSource} = useSourceTypes();
    const [RadioInvalidMessage, updateRadioInvalidMessage] = managedInvalidMessage(radioRef);

    React.useEffect(
        updateRadioInvalidMessage,
        [sourceTypes, selectedSource, updateRadioInvalidMessage]
    );

    return (
        <React.Fragment>
            <div className="question">In which source did you find this error?</div>
            <div className="radio-columns">
                <RadioInvalidMessage />
                {
                    sourceTypes.map((sType, index) => (
                        <LabeledButton
                            key={sType}
                            sType={sType} selectedSource={selectedSource}
                            onChange={onChange} radioRef={index === 0 ? radioRef : null}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
}
