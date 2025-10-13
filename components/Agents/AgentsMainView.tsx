import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import lendToAgent from "actions/agents/lendToAgent";
import takeFromAgent from "actions/agents/takeFromAgent";

import AgentFilter, { SHOW_ALL_AGENTS } from "components/Agents/AgentFilter";
import AgentInventoryItemPicker from "components/Agents/AgentInventoryItemPicker";
import FreeAgent from "components/Agents/FreeAgent";
import WorkingAgent from "components/Agents/WorkingAgent";

import { useAppSelector } from "features/app/store";

import { Agent } from "types/agents";
import { IQuality } from "types/qualities";

export default function AgentsMainView() {
  const dispatch = useDispatch();

  const agents = useAppSelector((state) => state.agents.agents);
  const outfit = useAppSelector((state) => state.outfit);

  const [inventoryAgent, setInventoryAgent] = useState<Agent | undefined>(
    undefined
  );
  const [inventoryCategory, setInventoryCategory] = useState<string>("");
  const [inventoryOptions, setInventoryOptions] = useState<IQuality[]>([]);
  const [isInventoryPickerOpen, setIsInventoryPickerOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [filterValue, setFilterValue] = useState(SHOW_ALL_AGENTS);

  const workingAgents = useMemo(() => {
    return agents.filter(
      (agent) =>
        agent.plot !== undefined &&
        (filterValue === SHOW_ALL_AGENTS ||
          agent.levels.some((l) => l.name === filterValue))
    );
  }, [agents, filterValue]);

  const freeAgents = useMemo(() => {
    return agents.filter(
      (agent) =>
        agent.plot === undefined &&
        (filterValue === SHOW_ALL_AGENTS ||
          agent.levels.some((l) => l.name === filterValue))
    );
  }, [agents, filterValue]);

  const handleRequestClose = useCallback(() => {
    setIsInventoryPickerOpen(false);
  }, []);

  const handleChoose = useCallback(
    async (category: string, quality?: IQuality) => {
      if (inventoryAgent === undefined) {
        return;
      }

      setIsChanging(true);

      if (quality) {
        const borrowers = agents.filter((a) =>
          a.inventory.map((i) => i.id).includes(quality.id)
        );
        const workingAgentCount = borrowers.filter((b) => b.plot).length;
        const unclaimedCount = quality.level - borrowers.length - 1;
        const wornItemId = outfit.slots[category]?.id;

        const shouldFetchOutfit =
          wornItemId === quality.id &&
          unclaimedCount <= 0 &&
          workingAgentCount < quality.level &&
          (borrowers.length === 0 || borrowers.length === workingAgentCount);

        await dispatch(
          lendToAgent(
            inventoryAgent.id,
            quality.id,
            shouldFetchOutfit,
            undefined
          )
        );
      } else {
        await dispatch(takeFromAgent(inventoryAgent.id, category, undefined));
      }

      setIsChanging(false);
    },
    [agents, dispatch, inventoryAgent, outfit]
  );

  return (
    <>
      <div className="agent-filter-group">
        <span className="agent-filter-label">Show:</span>
        <AgentFilter category={filterValue} setCategory={setFilterValue} />
      </div>

      {workingAgents
        .sort((a, b) => {
          const aIsDone = (a.plot?.elapsed ?? 0) >= (a.plot?.duration ?? 0);
          const bIsDone = (b.plot?.elapsed ?? 0) >= (b.plot?.duration ?? 0);

          if (aIsDone === bIsDone) {
            return a.id - b.id;
          }

          return aIsDone ? -1 : 1;
        })
        .map((agent) => (
          <WorkingAgent agent={agent} key={agent.name} />
        ))}

      {freeAgents.map((agent) => (
        <FreeAgent
          agent={agent}
          key={agent.name}
          isChanging={isChanging}
          setInventoryAgent={setInventoryAgent}
          setInventoryCategory={setInventoryCategory}
          setInventoryOptions={setInventoryOptions}
          setIsInventoryPickerOpen={setIsInventoryPickerOpen}
        />
      ))}

      <AgentInventoryItemPicker
        agent={inventoryAgent}
        agents={agents}
        header={inventoryCategory}
        isOpen={isInventoryPickerOpen}
        onChoose={handleChoose}
        onRequestClose={handleRequestClose}
        qualities={inventoryOptions}
      />
    </>
  );
}

AgentsMainView.displayName = "AgentsMainView";
