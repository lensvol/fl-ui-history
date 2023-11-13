import React from "react";

import ToolTip from "components/Tooltip";

export type OwnProps = {
  hasEnoughFate: boolean;
  hasActionRefreshes: boolean;
};

export default function FateRefreshTooltip({
  hasEnoughFate,
  hasActionRefreshes,
}: OwnProps) {
  const data = {
    image: hasActionRefreshes ? "enhanced" : "fate",
    secondaryDescription: hasActionRefreshes
      ? "Use your Enhanced Refreshes..."
      : hasEnoughFate
        ? "Refresh your Actions with Fate..."
        : "Not enough Fate! Purchase more...",
  };

  return <ToolTip data={data} />;
}

FateRefreshTooltip.displayName = "FateRefreshTooltip";
