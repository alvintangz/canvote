import React, {useState} from 'react';
import {MediaFile} from "../../../interfaces/models";
import './FilePicker.scss';


interface FilePickerProps {
    presetFile?: MediaFile;
    required: boolean;
    label: string;
    onFileSelected: (file: File, event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
}

export default (props: FilePickerProps) => {
    const [file, setFile] = useState(null);
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.validity && event.target.files && event.target.files.length === 1) {
            setFile(event.target.files[0]);
            props.onFileSelected(event.target.files[0], event)
        }
    };

    return (
        <div className="form-group">
            <label className={ 'file-picker ' + (props.required && 'required') }>
                { props.label }
                <span className="btn btn-default">
                    Select file
                    <input type="file"
                           accept={ props.accept }
                           onChange={ onFileChange }
                           multiple={ false }
                           required={ props.required } />
                </span>
            </label>
            <div className="file-picker-info">
                <small>
                    { file && (<span><strong>Selected:</strong> {file.name}</span>) }
                    { file && props.presetFile && <br/> }
                    { props.presetFile && <span><strong>Current file:</strong> <a href={props.presetFile.location} target="_blank" rel="noopener noreferrer">{ props.presetFile.filename }</a></span> }
                </small>
            </div>
        </div>

    );
};
