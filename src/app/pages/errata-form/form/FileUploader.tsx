import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import cn from 'classnames';

type FileButtonProps = {
    name: string;
    accept?: string;
    maxBytes?: number;
};

const BYTES_PER_MB = 1024 * 1024;

// The picker's accept list is only a hint (people can switch it to "All files"),
// so a file with an extension that accept doesn't list is turned away here too.
// Only extensions are checked, not entries like image/*.
function problemWithFile(file: File, accept?: string, maxBytes?: number) {
    const extensions = (accept ?? '').split(',').filter((entry) => entry.startsWith('.'));

    if (extensions.length && !extensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        return `That type of file can't be attached. Choose a ${
            extensions.map((ext) => ext.slice(1).toUpperCase()).join(', ')
        } file.`;
    }
    if (maxBytes && file.size > maxBytes) {
        return `That file is too large. The limit is ${Math.floor(maxBytes / BYTES_PER_MB)} MB.`;
    }
    return '';
}

export function FileButton({name, accept, maxBytes}: FileButtonProps) {
    const [filePath, updateFilePath] = useState('');
    const [problem, setProblem] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const empty = filePath === '';

    function setFile(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target;
        // The list is empty if the picker was cancelled, which is no problem
        const newProblem = Array.from(
            input.files as FileList,
            (file) => problemWithFile(file, accept, maxBytes)
        ).join('');

        setProblem(newProblem);
        if (newProblem) {
            // A rejected file must not be submitted with the form
            input.value = '';
        }
        updateFilePath(input.value.replace(/.*\\/, ''));
    }

    function clearFile() {
        // Empty the input too, or the file is still submitted with the form.
        // The clear button only exists once a file is chosen, so the input does.
        (inputRef.current as HTMLInputElement).value = '';
        updateFilePath('');
    }

    // The input is hidden, so the label is what takes focus; a label with
    // role="button" does nothing on Enter or Space unless we pass them on
    function openOnEnterOrSpace(event: React.KeyboardEvent<HTMLLabelElement>) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
        }
    }

    // UNCOMMENT FOR TESTING
    // React.useEffect(() => {
    //     console.info('Files:',
    //         Array.from(
    //             document.querySelectorAll('[type="file"]')
    //         ).map((i) => i.value)
    //     );
    // });

    return (
        <React.Fragment>
            <div className={cn('file-button', {empty})}>
                <label
                    className="btn"
                    role="button"
                    tabIndex={0}
                    onKeyDown={openOnEnterOrSpace}
                >
                    {filePath ? 'Change' : 'Add file'}
                    <input
                        type="file"
                        className="hidden"
                        ref={inputRef}
                        name={name}
                        accept={accept}
                        onChange={setFile}
                    />
                </label>
                {filePath && (
                    <React.Fragment>
                        <span className="file-name">{filePath}</span>
                        <button
                            type="button"
                            className="clear-file"
                            aria-label="Clear file"
                            onClick={clearFile}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </React.Fragment>
                )}
            </div>
            {problem && <div className="file-problem" role="alert">{problem}</div>}
        </React.Fragment>
    );
}

export default function FileUploader() {
    return (
        <React.Fragment>
            <FileButton name="file_1" />
            <FileButton name="file_2" />
        </React.Fragment>
    );
}
