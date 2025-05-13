import React, { useCallback } from "react";

import classnames from "classnames";

import AgentInventoryItemPickerEntry, {
  LoanableItem,
} from "components/Agents/AgentInventoryItemPickerEntry";
import Modal from "components/Modal";

import { useAppSelector } from "features/app/store";

import { Agent } from "types/agents";
import { IEnhancement, IQuality } from "types/qualities";

interface Props {
  agent?: Agent;
  agents: Agent[];
  header: string;
  isOpen: boolean;
  onChoose: (category: string, quality?: IQuality) => void;
  onRequestClose: () => void;
  qualities: IQuality[];
}

const OtherItems = "Other Items";

export default function AgentInventoryItemPicker({
  agent,
  agents,
  header,
  isOpen,
  onChoose,
  onRequestClose,
  qualities,
}: Props) {
  // name of the category for this picker
  const category = qualities.map((quality) => quality.category).find((c) => c)!;

  // quality id of the item in this category that the *player* is currently wearing (if any)
  const wornItemId = useAppSelector(
    (state) => state.outfit.slots[category]?.id
  );

  // indicates whether this agent has already been given an item for this category
  const isSlotOccupied =
    agent?.inventory.some((i) => i.category === category) ?? false;

  // the contents of qualities, split into groups for presentation (key is a quality id)
  const inventoryMap: Record<string, IQuality[]> = {
    "Well Suited": [],
    OtherItems: [],
  };

  const agentEnhancementQualityNames =
    agent?.levels
      .filter(
        (level) =>
          level.category !== "AgentStat" && level.category !== "AgentStatHidden"
      )
      .filter((level) => level.level > 0)
      .map((level) => level.name) ?? [];

  // the keys that will appear in inventoryMap
  const inventoryMapKeys = [...agentEnhancementQualityNames, OtherItems];

  inventoryMapKeys.forEach((key) => {
    inventoryMap[key] = [];
  });

  qualities.forEach((q) => {
    const hintedEnhancementIds =
      q.enhancements
        ?.filter((enh) => enh.level > 0)
        .map((enh) => enh.qualityName)
        .filter((enhId) => inventoryMapKeys.includes(enhId)) ?? [];

    if (hintedEnhancementIds.length === 0) {
      inventoryMap[OtherItems].push(q);
    } else {
      hintedEnhancementIds.forEach((hintedEnhancementId) => {
        inventoryMap[hintedEnhancementId].push(q);
      });
    }
  });

  inventoryMapKeys.forEach((key) => {
    inventoryMap[key].sort((a, b) => sorter(a, b, key));
  });

  const handleClick = useCallback(
    (item?: IQuality) => {
      onChoose(category, item);
      onRequestClose();
    },
    [category, onChoose, onRequestClose]
  );

  if (!agent) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      className="modal-dialog--agent-inventory-picker"
      onRequestClose={onRequestClose}
    >
      <div className="agent-inventory-picker">
        <h1 className="agent-inventory-picker-header">
          {header}
          {isSlotOccupied && (
            <>
              {" "}
              (
              <span
                className={classnames(
                  isSlotOccupied && "agent-inventory-picker-unequip"
                )}
                onClick={() => handleClick()}
              >
                Unequip
              </span>
              )
            </>
          )}
        </h1>

        <div className="agent-inventory-picker__scrollbox">
          {inventoryMapKeys
            .filter((key) => inventoryMap[key].length > 0)
            .map((key) => (
              <div className="agent-inventory-picker__item-group" key={key}>
                <h2
                  className={classnames(
                    "agent-inventory-picker__item-group-header",
                    key === OtherItems &&
                      "agent-inventory-picker__item-group-header-other-items"
                  )}
                >
                  {key}
                </h2>

                <div className="agent-inventory-picker__items">
                  {inventoryMap[key]
                    .map(
                      (q) =>
                        ({
                          ...q,
                          borrowers: agents.filter((a) =>
                            a.inventory.map((i) => i.id).includes(q.id)
                          ),
                          isWorn: q.id === wornItemId,
                        }) as LoanableItem
                    )
                    .map((item) => (
                      <AgentInventoryItemPickerEntry
                        key={item.id}
                        agent={agent}
                        handleClick={handleClick}
                        hints={[]}
                        item={item}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}

AgentInventoryItemPicker.displayName = "AgentInventoryItemPicker";

function getHintedSortLevel(enhancement?: IEnhancement) {
  return (
    (enhancement?.level ?? 0) *
    ((enhancement?.category ?? "") === "Skills" ? 10 : 1)
  );
}

// take in: quality name; inventory item
// return: IEnhancement for item whose name is key
function getKeyedQuality(item: IQuality, key: string) {
  if (!item.enhancements || item.enhancements.length === 0) {
    return undefined;
  }

  if (key === OtherItems) {
    // sort by quality id
    return item.enhancements.reduce((a, b) =>
      a.qualityId < b.qualityId ? a : b
    );
  }

  return item.enhancements.find((enh) => enh.qualityName === key);
}

function sorter(a: IQuality, b: IQuality, key: string) {
  const bestA = getKeyedQuality(a, key);
  const bestB = getKeyedQuality(b, key);

  if (bestA === undefined && bestB === undefined) {
    return a.id - b.id;
  }

  if (bestA === undefined) {
    return 1;
  }

  if (bestB === undefined) {
    return -1;
  }

  const enhSort = bestA.qualityId - bestB.qualityId;

  if (enhSort !== 0) {
    return enhSort;
  }

  // return enhSort;
  return getHintedSortLevel(bestB) - getHintedSortLevel(bestA);
}
