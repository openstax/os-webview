import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';
import cn from 'classnames';

function FileButton({name}) {
    const [filePath, updateFilePath] = useState('');
    const empty = filePath === '';

    function setFile(event) {
        updateFilePath(event.target.value.replace(/.*\\/, ''));
    }

    function clearFile(event) {
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
            <label className="btn" role="button" tabIndex="0">
                {filePath ? 'Change' : 'Add file'}
                <input type="file" className="hidden" name={name} onChange={setFile} />
            </label>
            {
                filePath &&
                    <React.Fragment>
                        <span className="file-name">{filePath}</span>
                        <button type="button" className="clear-file" aria-label="Clear file" onClick={clearFile}>
                            <FontAwesomeIcon icon="times" />
                        </button>
                    </React.Fragment>
            }
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
