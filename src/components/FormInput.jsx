import React from 'react';

const FormInput = ({ label, value, onChange, type = 'text', required = false, placeholder }) => (
  <div className="mb-2">
    {label && <label className="form-label">{label}</label>}
    <input
      className="form-control"
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder || label}
    />
  </div>
);

export default FormInput; 