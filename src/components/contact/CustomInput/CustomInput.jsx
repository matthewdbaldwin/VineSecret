import React from 'react';

const CustomInput = (props) => {
    const { autoComplete = 'off', input, meta, placeholder, className, type = 'text' } = props;
    const hasError = meta.touched && meta.error;

    if (type === 'textarea') {
        return (
            <div className="field-group">
                <textarea
                    {...input}
                    className={className}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    rows={4}
                />
                {hasError && <div className="dangererror">{hasError}</div>}
            </div>
        );
    }

    return (
        <div className="field-group">
            <input
                {...input}
                className={className}
                placeholder={placeholder}
                type={type}
                autoComplete={autoComplete}
            />
            {hasError && <div className="dangererror">{hasError}</div>}
        </div>
    );
};

export default CustomInput;
