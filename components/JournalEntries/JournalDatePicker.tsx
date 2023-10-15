import classnames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import DatePicker from "react-date-picker";

interface Props {
  onChange: (date: Date) => void;
}

export default function JournalDatePicker({ onChange }: Props) {
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
      <>
        <span className={classnames("fa", "fa-calendar-o", "link")}></span>
      </>
    );
  }, []);

  return (
    <DatePicker
      calendarIcon={calendarIcon}
      className="journal-date-picker"
      maxDate={new Date()}
      onChange={handleChange}
      value={value}
    />
  );
}
