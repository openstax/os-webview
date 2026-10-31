import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import cn from 'classnames';

type FileButtonProps = {
    name: string;
    accept?: string;
};

export function FileButton({name, accept}: FileButtonProps) {
    const [filePath, updateFilePath] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const empty = filePath === '';

    function setFile(event: React.ChangeEvent<HTMLInputElement>) {
        updateFilePath(event.target.value.replace(/.*\\/, ''));
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
