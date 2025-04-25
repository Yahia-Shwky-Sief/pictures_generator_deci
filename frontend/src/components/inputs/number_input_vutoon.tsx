import React from 'react';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, step, }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div>
            <input
                style={{ width: '200px', height: '40px', borderRadius: '5px', backgroundColor: '#f0f0f0', color: '#000', border: '1px solid #ccc', padding: '5px' }}
                type="number"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
};

export default NumberInput;