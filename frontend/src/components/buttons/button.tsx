import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, className = '' }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn ${className} ${disabled ? 'btn-disabled' : ''}`}
            style={{width: '200px', height: '40px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer'}}
        >
            {label}
        </button>
    );
};

export default Button;