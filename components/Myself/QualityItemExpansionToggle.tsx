import Buttonlet from "components/Buttonlet";
import React from "react";

export function QualityItemExpansionToggle({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick: () => void;
}) {
  return <Buttonlet type={expanded ? "minus" : "plus"} onClick={onClick} />;
}

export default QualityItemExpansionToggle;
