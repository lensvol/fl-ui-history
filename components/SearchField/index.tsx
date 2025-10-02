import React, { ChangeEvent, CSSProperties } from "react";

import classnames from "classnames";

export default function SearchField({
  className,
  id,
  onChange,
  placeholder,
  style,
  value,
}: Props) {
  return (
    <input
      className={classnames("form__control input--item-search", className)}
      id={id}
      onChange={onChange}
      placeholder={placeholder ?? "Search"}
      style={style}
      type="text"
      value={value}
    />
  );
}

SearchField.displayName = "SearchField";

type Props = {
  className?: string;
  id?: string;
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
  value: string;
};
