import { buildTooltipData } from "components/SidebarQualities/utils";
import React from "react";
import { IQuality } from "types/qualities";

import DisplayQualityMdUp from "./DisplayQualityMdUp";
import DisplayQualitySmDown from "./DisplayQualitySmDown";

type Props = {
  isChanging: boolean;
  item: IQuality;
  onClick: () => any;
};

export default function DisplayQuality({ isChanging, item, onClick }: Props) {
  const tooltipData = {
    ...buildTooltipData(item),
    smallButtons: [
      {
        label: "Change",
        action: onClick,
      },
    ],
  };
  return (
    <>
      <DisplayQualitySmDown
        {...item}
        isChanging={isChanging}
        onClick={onClick}
        tooltipData={tooltipData}
      />
      <DisplayQualityMdUp
        {...item}
        isChanging={isChanging}
        onClick={onClick}
        tooltipData={tooltipData}
      />
    </>
  );
}

DisplayQuality.displayName = "DisplayQuality";
