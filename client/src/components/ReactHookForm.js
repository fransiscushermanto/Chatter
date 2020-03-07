import React from "react";
import PropTypes from "prop-types";
export const Input = ({ name, defaultValues, required, register, style }) => {
  return (
    <fieldset>
      <div style={style} className="form-group wrapper">
        <input
          name={name}
          className="input-field form-control"
          defaultValue={defaultValues}
          ref={register({ required })}
        />
      </div>
    </fieldset>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  register: PropTypes.func
};

export const AuthInput = ({
  name,
  defaultValues,
  required,
  register,
  style,
  type,
  id,
  autoComplete,
  placeholder
}) => {
  return (
    <div style={style} className="form-group wrapper">
      <input
        name={name}
        id={id}
        className="input-field form-control"
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValues}
        ref={register({ required })}
        autoComplete={autoComplete}
      />
    </div>
  );
};

AuthInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  required: PropTypes.bool,
  autoComplete: PropTypes.string
};
