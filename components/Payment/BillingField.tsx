import { Field } from "formik";
import React from "react";

export interface BillingFieldProps {
  name: string;
  value: string;
  label: string;
  maxlength?: number;
  required?: boolean;
}

export default function BillingField({
  name,
  value,
  label,
  maxlength,
  required,
}: BillingFieldProps) {
  return (
    <p>
      {/* <label htmlFor={name}>{label}</label> */}
      <BillingFieldLabelContainer
        name={name}
        value={value}
        label={label}
        maxlength={maxlength}
      />
      <Field
        className="form__control"
        value={value}
        name={name}
        required={required}
        maxlength={maxlength}
      />
    </p>
  );
}

function BillingFieldLabelContainer({
  name,
  value,
  label,
  maxlength,
}: BillingFieldProps) {
  if (maxlength === undefined) {
    return <label htmlFor={name}>{label}</label>;
  }

  return (
    <span style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span>
        {value.length}/{maxlength}
      </span>
    </span>
  );
}
