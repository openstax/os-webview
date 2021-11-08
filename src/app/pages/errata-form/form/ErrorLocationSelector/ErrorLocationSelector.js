import React, {useState, useRef, useEffect} from 'react';
import useErrataFormContext from '../../errata-form-context';
import managedInvalidMessage from '../InvalidMessage';
import TocSelector from './toc-selector';
import './ErrorLocationSelector.scss';

function AdditionalLocationInput({value='', readOnly=false, updateValue, required=true}) {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    function onChange(event) {
        updateValue(event.target.value);
    }

    useEffect(updateInvalidMessage, [required, updateInvalidMessage]);

    return (
        <React.Fragment>
            <div className="question">Additional location information, if applicable</div>
            <InvalidMessage />
            <input
                type="text" name="additional_location_information"
                placeholder="Describe where you found the error"
                value={value} onChange={onChange}
                ref={inputRef} readOnly={readOnly}
                required={required}
            />
        </React.Fragment>
    );
}

function DefaultValue({defaultValue}) {
    return (
        <AdditionalLocationInput value={defaultValue} readOnly={true} />
    );
}

function NotDefaultValue({defaultValue}) {
    const [tocV, updateTocV] = useState();
    const [addlV, updateAddlV] = useState(defaultValue);
    const required = () => !tocV && !addlV;

    return (
        <React.Fragment>
            <TocSelector required={required()} updateValue={updateTocV} />
            <AdditionalLocationInput value={addlV} required={required()} updateValue={updateAddlV} />
        </React.Fragment>
    );
}

export default function ErrorLocationSelector() {
    const {searchParams} = useErrataFormContext();
    const defaultValue = searchParams.get('location');
    const readOnly = defaultValue && searchParams.get('source');
    const Input = (readOnly) ? DefaultValue : NotDefaultValue;

    return (
        <Input defaultValue={defaultValue} />
    );
}
