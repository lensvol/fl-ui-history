import { Field } from "formik";
import React from "react";

export interface BillingFieldProps {
  name: string;
  value: string;
  label: string;
  required?: boolean;
}

export default function BillingField({
  name,
  value,
  label,
  required,
}: BillingFieldProps) {
  return (
    <p>
      <label htmlFor={name}>{label}</label>
      <Field
        className="form__control"
        value={value}
        name={name}
        required={required}
      />
    </p>
  );
}
