import React, { CSSProperties, useCallback } from "react";

interface Props {
  data: { name: string }[];
  gotoItem: (_: any, __: { offset: number }) => void;
  style?: CSSProperties;
}

export default function CategorySelector(props: Props) {
  const { data, gotoItem, style } = props;

  const handleChange = useCallback(
    (evt: any) => {
      const item = data.find((item) => item.name === evt.target.value);
      gotoItem(item, { offset: -50 });
    },
    [data, gotoItem]
  );

  return (
    <select
      className="form__control category-jumper"
      onChange={handleChange}
      style={style}
    >
      {data.map((item, i) => (
        <option key={i}>{item.name}</option>
      ))}
    </select>
  );
}

CategorySelector.displayName = "CategorySelector";
