import React from "react";

export default function ActionCost({ cost }: { cost: number }) {
  return (
    <span>
      {" "}
      <span className="button__more">({cost})</span>
    </span>
  );
}

ActionCost.displayName = "ActionCost";
