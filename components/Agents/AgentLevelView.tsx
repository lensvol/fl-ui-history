import React, { SyntheticEvent, useCallback } from "react";
import Interactive, { ClickType } from "react-interactive";
import { useDispatch } from "react-redux";

import classnames from "classnames";

import { openModalTooltip } from "actions/modalTooltip";

import { agentBonusToString } from "components/Agents/agentBonusToString";
import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";

import { AgentLevel } from "types/agents";

import getImagePath from "utils/getImagePath";

type Props = {
  className?: string;
  level: AgentLevel;
};

export default function AgentLevelView({ className, level }: Props) {
  const dispatch = useDispatch();

  const tooltipData: ITooltipData = {
    name: level.name,
    description: level.level + agentBonusToString(level),
    secondaryDescription:
      level.category === "AgentStat" || level.category === "ConcernStat"
        ? "Agent Quality"
        : undefined,
  };

  const handleClick = useCallback(
    (evt: SyntheticEvent, clickType: ClickType) => {
      // This element is non-interactive, so a regular mouse click should do nothing.
      if (clickType === "mouseClick") {
        return;
      }

      // Otherwise, this was a tap event (or similar) that requires us to show the info tooltip.
      const imagePath = getImagePath({
        icon: level.image,
        type: "small-icon",
      });

      dispatch(
        openModalTooltip({
          ...tooltipData,
          imagePath,
        })
      );
    },
    [dispatch, level, tooltipData]
  );

  return (
    <Interactive
      as="div"
      className={classnames("agent-stat-wrapper", className)}
      onClick={handleClick}
      style={{
        cursor: "default",
      }}
    >
      <TippyWrapper tooltipData={tooltipData}>
        <div className="agent-stat" key={level.name}>
          <Image defaultCursor icon={level.image} type="small-icon" />
          <span className="agent-stat-level">
            {(level?.level ?? 0) + (level?.bonus ?? 0)}
          </span>
        </div>
      </TippyWrapper>
    </Interactive>
  );
}

AgentLevelView.displayName = "AgentLevelView";
