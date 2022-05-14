import React, {
  ChangeEvent,
  CSSProperties,
} from 'react';
import classnames from 'classnames';

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
      type="text"
      className={classnames('form__control input--item-search', className)}
      placeholder={placeholder ?? 'Search'}
      value={value}
      onChange={onChange}
      id={id}
      style={style}
    />
  );
}

SearchField.displayName = 'SearchField';

type Props = {
  className?: string,
  id?: string,
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void,
  placeholder?: string,
  style?: CSSProperties,
  value: string,
};
