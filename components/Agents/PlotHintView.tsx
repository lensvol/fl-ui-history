import React from "react";

import { agentBonusToString } from "components/Agents/agentBonusToString";
import Image from "components/Image";

import { AgentLevel, PlotHint } from "types/agents";

type Props = {
  hint: PlotHint;
  level?: AgentLevel;
};

export default function PlotHintView({ hint, level }: Props) {
  const tooltipDescription =
    "At " +
    (level?.level ?? 0) +
    agentBonusToString(level) +
    " " +
    hint.name +
    ", your agent has a roughly " +
    Math.min(100, hint.chance) +
    "% chance of succeeding at a typical check in this Plot.";

  return (
    <div className="plot__hint">
      <Image
        icon={hint.image}
        alt={hint.name}
        type="small-icon"
        tooltipData={{
          description: tooltipDescription,
        }}
      />
      <div>
        Your agent's {hint.name} is {chanceToDescriptor(hint.chance)} for this
        assignment.
      </div>
    </div>
  );
}

PlotHintView.displayName = "PlotHintView";

function chanceToDescriptor(chance: number) {
  if (chance <= 10) {
    return "woefully inadequate";
  }

  if (chance <= 20) {
    return "inadequate";
  }

  if (chance <= 50) {
    return "lacking";
  }

  if (chance <= 70) {
    return "adequate";
  }

  if (chance <= 90) {
    return "solid";
  }

  if (chance <= 150) {
    return "potent";
  }

  return "unnecessarily potent";
}
