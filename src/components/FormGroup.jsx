import React from "react";

const FormGroup = ({
  label,
  componentType,
  name,
  value,
  options,
  onChange
}) => {
  const renderInput = () => (
    <input
      type="text"
      id={name}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
    />
  );
  const renderSelect = () => (
    <select
      value={value}
      onChange={onChange}
      className="form-control custom-select"
    >
      <option>Choose here</option>
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </select>
  );
  return (
    <div className="form-group">
      <label>{label}</label>
      {componentType === "input" && renderInput()}
      {componentType === "select" && renderSelect()}
    </div>
  );
};

export default FormGroup;
