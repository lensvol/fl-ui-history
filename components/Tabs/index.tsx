import React from "react";

import Tab from "./Tab";
import { UIRestriction } from "types/myself";

type Props = {
  // active: string,
  items: any[];
  uiRestrictions?: UIRestriction[];
};

export default function Tabs({
  // active,
  items,
  uiRestrictions,
}: Props) {
  return (
    <ul role="tablist">
      {items
        .filter(
          (item) =>
            !item.uiRestriction ||
            !uiRestrictions?.find(
              (restriction) => restriction === item.uiRestriction
            )
        )
        .map((item) => (
          <Tab
            key={item.value}
            id={item.value}
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
