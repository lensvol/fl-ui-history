import React from "react";

import SidebarQuality from "components/SidebarQualities/SidebarQuality";
import { buildTooltipData } from "components/SidebarQualities/utils";

import { useAppSelector } from "features/app/store";

import getSidebarQualities from "selectors/myself/getSidebarQualities";

import { IQuality } from "types/qualities";

export default function SidebarQualities() {
  const qualities = useAppSelector((state) => getSidebarQualities(state));

  return (
    <ul className="items items--list">
      {qualities
        .filter((q) => q.effectiveLevel > 0)
        .map((q: IQuality) => (
          <SidebarQuality
            key={q.id}
            {...q}
            tooltipData={buildTooltipData({
              ...q,
              useCap: true,
            })}
          />
        ))}
    </ul>
  );
}

SidebarQualities.displayName = "SidebarQualities";
