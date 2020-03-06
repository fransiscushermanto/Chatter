import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";

export function Form({ defaultValues, children, onSubmit }) {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Array.isArray(children)
        ? children.map(child => {
            return child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register: methods.register,
                    key: child.props.name
                  }
                })
              : child;
          })
        : children}
    </form>
  );
}

export function Input({ register, name, defaultValues, ...rest }) {
  const {
    formState: { dirty }
  } = useFormContext();
  return React.useMemo(
    () => (
      <fieldset>
        <div className="form-group wrapper">
          <input
            name={name}
            className="input-field form-control"
            defaultValue={defaultValues}
            ref={register}
            {...rest}
          />
        </div>
      </fieldset>
    ),
    [dirty, register, name, defaultValues, rest]
  );
}
