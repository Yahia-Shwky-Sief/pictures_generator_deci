import React from 'react';

interface FileInputButtonProps {
    onFileSelect: (file: File | null) => void;
    buttonText?: string;
}

const FileInputButton: React.FC<FileInputButtonProps> = ({ onFileSelect, buttonText = "Upload File" }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onFileSelect(file);
    };

    return (
        <div>
            <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', textAlign: 'center', width: '200px'  }}>
                {buttonText}
            </label>
            <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileInputButton;