import React from "react";
import { connect } from "react-redux";

import getSidebarQualities from "selectors/myself/getSidebarQualities";

import { IAppState } from "types/app";
import { IQuality } from "types/qualities";
import SidebarQuality from "./SidebarQuality";
import { buildTooltipData } from "./utils";

export function SidebarQualities({ qualities }: Props) {
  return (
    <ul className="items items--list">
      {qualities
        .filter((q) => q.effectiveLevel > 0)
        .map((q: IQuality) => (
          <SidebarQuality
            key={q.id}
            {...q}
            tooltipData={buildTooltipData({ ...q, useCap: true })}
          />
        ))}
    </ul>
  );
}

SidebarQualities.displayName = "SidebarQualities";

const mapStateToProps = (state: IAppState) => ({
  qualities: getSidebarQualities(state),
});
type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SidebarQualities);
