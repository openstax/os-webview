import React, {useState, useRef, useMemo} from 'react';
import useErrataFormContext from '../errata-form-context';
import {type Book} from '~/helpers/books';
import managedInvalidMessage from './InvalidMessage';
import getFields from '~/models/errata-fields';

type SourceSelectorProps = {
    selectedSource: string | null;
    sType: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    radioRef?: React.RefObject<HTMLInputElement>;
};

type SubnoteProps = {
    sType: string;
};

const sourceNames: Record<string, string> = {
};

const resourcePromise = getFields('resources')
    .then((resources: {field: string}[]) => resources.map((entry) => entry.field));

function OtherSourceInput() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return (
        <div className="other-group">
            <InvalidMessage />
            <input
                type="text"
                name="resource_other" maxLength={250}
                ref={inputRef} onChange={updateInvalidMessage}
                required
            />
        </div>
    );
}

const subnotes: Record<string, string> = {'Textbook': 'includes print, PDF, and web view'};

function Subnote({sType}: SubnoteProps) {
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

function LabeledButton({selectedSource, sType, onChange, radioRef}: SourceSelectorProps) {
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

function filterForBook(bookInfo: Book) {
    // eslint-disable-next-line complexity
    return function (type: string) {
        if (type.startsWith('Assignable')) {
            return bookInfo.assignable_book;
        }
        if (type.startsWith('Kindle')) {
            return Boolean(bookInfo.kindle_link);
        }
        if (type === 'Instructor solution manual') {
            return bookInfo.book_faculty_resources?.find(
                (r) => (/^Instructor (Solution|Answer)/).test(r.resource_heading)
            );
        }
        if (type === 'Student solution manual') {
            return bookInfo.book_student_resources?.find(
                (r) => (/^Student (Solution|Answer)/).test(r.resource_heading)
            );
        }
        return true;
    };
}

function useSourceTypes() {
    const {searchParams, selectedBook} = useErrataFormContext();
    const source = searchParams.get('source');
    const initialSource = source && sourceNames[source.toLowerCase()];
    const [sourceTypes, updateSourceTypes] = useState<string[]>([]);
    const filteredSourceTypes = useMemo(
        () => sourceTypes.filter(filterForBook(selectedBook ?? {} as Book)),
        [sourceTypes, selectedBook]
    );
    const [selectedSource, updateSelectedSource] = useState(initialSource);
    const onChange = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => updateSelectedSource(value),
        []
    );

    React.useEffect(
        () => {
            resourcePromise.then(updateSourceTypes);
        },
        [selectedBook]
    );

    return {sourceTypes: filteredSourceTypes, selectedSource, onChange};
}

export default function ErrorSourceSelector() {
    const radioRef = useRef<HTMLInputElement>(null);
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
                            onChange={onChange} radioRef={index === 0 ? radioRef : undefined}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
}
