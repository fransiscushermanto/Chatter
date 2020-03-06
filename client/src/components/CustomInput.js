import React from "react";

const CustomInput = props => {
  let {
    input: { value, onChange }
  } = props;
  return (
    <div className="form-group wrapper">
      <input
        name={props.name}
        id={props.id}
        className="input-field form-control"
        placeholder={props.placeholder}
        type={props.type}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default CustomInput;
