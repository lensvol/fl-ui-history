import React, { useCallback, useMemo, useState } from "react";

import DatePicker from "react-date-picker";

import classnames from "classnames";

interface Props {
  classNames?: {
    calendarClassName?: string;
    datePickerClassName?: string;
    iconClassName?: string;
    wrapperClassName?: string;
  };
  isDisabled: boolean;
  onChange: (date: Date) => void;
}

export default function JournalDatePicker({
  classNames,
  isDisabled,
  onChange,
}: Props) {
  const [value, setValue] = useState<Date>(new Date());

  const handleChange = useCallback(
    (date: Date | Date[]) => {
      if (date instanceof Date) {
        // Set our own value
        setValue(date);

        // Run parent callback
        onChange(date);
      }
    },
    [onChange]
  );

  const calendarIcon = useMemo(() => {
    return (
      <span
        className={classnames("fa fa-calendar-o", classNames?.iconClassName)}
      />
    );
  }, [classNames]);

  return (
    <div
      className={classnames(
        classNames?.wrapperClassName,
        isDisabled && "button--disabled"
      )}
    >
      <DatePicker
        calendarClassName={classNames?.calendarClassName}
        calendarIcon={calendarIcon}
        className={classnames(
          classNames?.datePickerClassName,
          "journal-date-picker"
        )}
        maxDate={new Date()}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

JournalDatePicker.displayName = "JournalDatePicker";
