import React from "react";

import Tab from "./Tab";

type Props = {
  // active: string,
  items: any[];
};

export default function Tabs({
  // active,
  items,
}: Props) {
  return (
    <ul role="tablist">
      {items.map((item) => (
        <Tab
          key={item.value}
          id={item.value}
          onSelect={item.onSelect}
          name={item.value === "/" ? "story" : item.value}
          to={item.value}
        >
          {item.label}
        </Tab>
      ))}
    </ul>
  );
}

Tabs.displayName = "Tabs";
