import React, {useState, useRef, useEffect} from 'react';
import useErrataFormContext from '../../errata-form-context';
import managedInvalidMessage from '../InvalidMessage';
import TocSelector from './toc-selector';
import './ErrorLocationSelector.scss';

type AdditionalLocationInputProps = {
    value?: string;
    readOnly?: boolean;
    updateValue?: (value: string) => void;
    required?: boolean;
};

type InputComponentProps = {
    defaultValue: string | null;
};

function AdditionalLocationInput({value, readOnly=false, updateValue, required=true}: AdditionalLocationInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);
    const syncValue = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => updateValue?.(event.target.value),
        [updateValue]
    );

    useEffect(updateInvalidMessage, [required, updateInvalidMessage]);

    return (
        <React.Fragment>
            <label className="question" htmlFor="additional_location_information">
                Additional location information, if applicable
            </label>
            <InvalidMessage />
            <input
                id="additional_location_information"
                type="text" name="additional_location_information"
                placeholder="Describe where you found the error"
                value={value} onChange={syncValue}
                ref={inputRef} readOnly={readOnly}
                required={required}
            />
        </React.Fragment>
    );
}

function DefaultValue({defaultValue}: InputComponentProps) {
    return (
        <AdditionalLocationInput value={defaultValue as string} readOnly={true} />
    );
}

function NotDefaultValue({defaultValue}: InputComponentProps) {
    const [tocV, updateTocV] = useState<string | null>();
    const [addlV, updateAddlV] = useState(defaultValue || '');
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
