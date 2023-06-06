import React, {useState, useRef, useMemo} from 'react';
import useErrataFormContext from '../errata-form-context';
import managedInvalidMessage from './InvalidMessage.js';
import getFields from '~/models/errata-fields';
import {useDataFromSlug} from '~/helpers/page-data-utils';

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

function filterForBook(bookInfo, tutorBookList) {
    // eslint-disable-next-line complexity
    return function (type) {
        if (type.startsWith('iBooks')) {
            return Boolean(bookInfo.ibook_link);
        }
        if (type.startsWith('Rover')) {
            return false;
        }
        if (type.startsWith('Assignable')) {
            return bookInfo.assignable_book;
        }
        if (type.endsWith('Tutor')) {
            return tutorBookList.includes(bookInfo.title);
        }
        if (type.endsWith('SE')) {
            return bookInfo.enable_study_edge;
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

function useTutorBookList() {
    const tutorPageData = useDataFromSlug('pages/openstax-tutor');
    const list = useMemo(
        () => tutorPageData?.tutor_books?.map((b) => b.title) || [],
        [tutorPageData]
    );

    return list;
}

function useSourceTypes() {
    const {searchParams, selectedBook} = useErrataFormContext();
    const source = searchParams.get('source');
    const initialSource = source && sourceNames[source.toLowerCase()];
    const [sourceTypes, updateSourceTypes] = useState([]);
    const tutorBookList = useTutorBookList();
    const filteredSourceTypes = useMemo(
        () => sourceTypes.filter(filterForBook(selectedBook, tutorBookList)),
        [sourceTypes, selectedBook, tutorBookList]
    );
    const [selectedSource, updateSelectedSource] = useState(initialSource);
    const onChange = React.useCallback(
        ({target: {value}}) => updateSelectedSource(value),
        []
    );

    React.useEffect(
        () => resourcePromise.then(updateSourceTypes),
        [selectedBook]
    );

    return {sourceTypes: filteredSourceTypes, selectedSource, onChange};
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
