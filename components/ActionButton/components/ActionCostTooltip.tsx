import React from "react";
import ToolTip from "components/Tooltip";

interface Props {
  cost: number;
}

export default function ActionCostTooltip({ cost }: Props) {
  const data = {
    image: "actions",
    secondaryDescription: `This will cost you ${
      cost > 0 ? cost : "no "
    } actions`,
  };
  return <ToolTip data={data} />;
}

ActionCostTooltip.displayName = "ActionCostTooltip";
