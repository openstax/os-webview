import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import cn from 'classnames';

type FileButtonProps = {
    name: string;
};

export function FileButton({name}: FileButtonProps) {
    const [filePath, updateFilePath] = useState('');
    const empty = filePath === '';

    function setFile(event: React.ChangeEvent<HTMLInputElement>) {
        updateFilePath(event.target.value.replace(/.*\\/, ''));
    }

    function clearFile() {
        updateFilePath('');
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
            <label className="btn" role="button" tabIndex={0}>
                {filePath ? 'Change' : 'Add file'}
                <input
                    type="file"
                    className="hidden"
                    name={name}
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
