import React from "react";
import ToolTip from "components/Tooltip";

export type OwnProps = { hasEnoughFate: boolean };

export default function FateRefreshTooltip({ hasEnoughFate }: OwnProps) {
  const data = {
    image: "fate",
    secondaryDescription: hasEnoughFate
      ? "Refresh your Actions with Fate..."
      : "Not enough Fate! Purchase more...",
  };
  return <ToolTip data={data} />;
}

FateRefreshTooltip.displayName = "FateRefreshTooltip";
