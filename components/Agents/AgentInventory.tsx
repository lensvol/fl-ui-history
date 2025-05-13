import React from "react";

import AgentInventoryItem from "components/Agents/AgentInventoryItem";

import { useAppSelector } from "features/app/store";

import { Agent } from "types/agents";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

type Props = {
  agent: Agent;
  editable?: boolean;
  isChanging?: boolean;
  setInventoryAgent: (newState?: Agent) => void;
  setInventoryCategory: (newState: string) => void;
  setInventoryOptions: (newState: IQuality[]) => void;
  setIsInventoryPickerOpen: (newState: boolean) => void;
};

export default function AgentInventory({
  agent,
  editable,
  isChanging,
  setInventoryAgent,
  setInventoryCategory,
  setInventoryOptions,
  setIsInventoryPickerOpen,
}: Props) {
  const slots = useAppSelector((state) =>
    Object.keys(state.outfit.slots)
      .map((name) => name as OutfitSlotName)
      .filter((name) => name !== "Treasure" && name !== "ToolOfTheTrade")
  );

  return (
    <div className="agent-inventory">
      {slots.map((name) => (
        <AgentInventoryItem
          agent={agent}
          editable={editable ?? false}
          isChanging={isChanging}
          key={name}
          name={name}
          setInventoryAgent={setInventoryAgent}
          setInventoryCategory={setInventoryCategory}
          setInventoryOptions={setInventoryOptions}
          setIsInventoryPickerOpen={setIsInventoryPickerOpen}
        />
      ))}
    </div>
  );
}

AgentInventory.displayName = "AgentInventory";
