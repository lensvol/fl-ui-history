import React from "react";

import DisplayQualityMdUp from "components/Myself/DisplayQuality/DisplayQualityMdUp";
import DisplayQualitySmDown from "components/Myself/DisplayQuality/DisplayQualitySmDown";
import { buildTooltipData } from "components/SidebarQualities/utils";

import { IQuality } from "types/qualities";

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
