import React, { useCallback, useState } from "react";

import classnames from "classnames";

import { Field } from "formik";

export default function PasswordField({
  className,
  name,
  required,
  validate,
  value,
}: Props) {
  const [show, setShow] = useState(false);

  const handleToggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <>
      <div className="password-field">
        <Field
          className={className}
          id={name}
          name={name}
          type={show ? "text" : "password"}
          required={required ?? false}
          validate={validate}
          value={value}
        />
        <i
          className={classnames(
            "fa",
            show ? "fa-eye" : "fa-eye-slash",
            className
          )}
          onClick={handleToggleShow}
        />
      </div>
    </>
  );
}

PasswordField.displayName = "PasswordField";

type Props = {
  className?: string;
  name: string;
  required?: boolean;
  validate?: (value: string) => void;
  value: string;
};
