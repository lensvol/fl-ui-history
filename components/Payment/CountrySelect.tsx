import { FieldProps } from "formik";
import React, { useCallback, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// *Why* would you publish a @types package without exporting the types? Anyway, this gets us
// CountryData in a somewhat roundabout way.
type CountryData = ReturnType<typeof countryList>["data"][number];

function getOptionWithNewValue(
  options: CountryData[],
  oldValue: string,
  newValue: string
) {
  const match = options.find((o) => o.value === oldValue);
  if (match === undefined) {
    return undefined;
  }

  return {
    ...match,
    value: newValue,
  };
}

export default function CountrySelect({ field, form }: FieldProps) {
  const baseOptions = useMemo(() => countryList().getData(), []);

  const options = useMemo(
    () =>
      [
        getOptionWithNewValue(baseOptions, "US", "US1"),
        getOptionWithNewValue(baseOptions, "GB", "GB1"),
        ...baseOptions,
      ].filter((s): s is CountryData => s !== undefined),
    [baseOptions]
  );

  const handleChange = useCallback(
    (option) => {
      form.setFieldValue(field.name, option?.value);
    },
    [field.name, form]
  );

  const styles = {
    // Keep the menu in front of the Braintree drop-in
    menu: (provided: any) => ({ ...provided, zIndex: 4 }),
  };

  return (
    <Select
      options={options}
      name={field.name}
      value={options.find((option) => option.value === field.value)}
      onChange={handleChange}
      onBlur={field.onBlur}
      styles={styles}
    />
  );
}
