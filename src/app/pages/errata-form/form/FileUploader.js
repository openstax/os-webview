import React, {useState, useEffect, useRef} from 'react';
import $ from '~/helpers/$';

function FileButton({name, parentRef}) {
    const inputRef = useRef();
    const [filePath, updateFilePath] = useState('');
    const isEmpty = () => filePath === '' ? 'empty' : '';

    function setFile(event) {
        updateFilePath(event.target.value.replace(/.*\\/, ''));
    }

    function clearFile(event) {
        updateFilePath('');
        inputRef.current.value = null;
    }

    // UNCOMMENT FOR TESTING
    // useEffect(() => {
    //     console.info('Files:',
    //         Array.from(parentRef.current.querySelectorAll('[type="file"]'))
    //             .map((i) => i.value)
    //     );
    // });

    return (
        <div className={`file-button ${isEmpty()}`}>
            <label className="btn" role="button" tabIndex="0">
                {filePath ? 'Change' : 'Add file'}
                <input type="file" className="hidden" name={name} onChange={setFile} ref={inputRef} />
            </label>
            {
                filePath && <span className="file-name">{filePath}</span>
            }
            {
                filePath &&
                <button type="button" className="clear-file" aria-label="Clear file" onClick={clearFile}>
                    <span className="fa fa-times"></span>
                </button>
            }
        </div>
    );
}

export default function FileUploader({Slot}) {
    const thisRef = useRef();

    return (
        <div className="button-group" ref={thisRef}>
            <FileButton name="file_1" parentRef={thisRef} />
            <FileButton name="file_2" parentRef={thisRef} />
            <Slot />
        </div>
    );
}
