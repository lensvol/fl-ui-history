import React, { useCallback, useMemo } from "react";

import classnames from "classnames";

import LockedSlotIcon from "components/Equipment/LockedSlotIcon";
import Image from "components/Image";
import Loading from "components/Loading";
import { MD } from "components/Responsive/breakpoints";

import { useAppSelector } from "features/app/store";

import { Agent } from "types/agents";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

import { createEquipmentQualityAltText } from "utils";
import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";

type Props = {
  agent: Agent;
  editable: boolean;
  name: OutfitSlotName;
  isChanging?: boolean;
  setInventoryAgent: (newState?: Agent) => void;
  setInventoryCategory: (newState: string) => void;
  setInventoryOptions: (newState: IQuality[]) => void;
  setIsInventoryPickerOpen: (newState: boolean) => void;
};

export default function AgentInventoryItem({
  name,
  agent,
  editable,
  isChanging,
  setIsInventoryPickerOpen,
  setInventoryCategory,
  setInventoryOptions,
  setInventoryAgent,
}: Props) {
  const emptySlotImage = useAppSelector(
    (state) =>
      state.myself.categories.find(
        (category) => category.name.replace(/ /g, "") === name
      )?.image
  );
  const inventoryItemsInCategory = useAppSelector((state) =>
    state.myself.qualities.filter((q) => q.category === name && q.level > 0)
  );

  const equippedQuality = useMemo(() => {
    return agent.inventory.find((q) => q.category === name);
  }, [agent, name]);

  const isAvailableItemsEmpty = useMemo(
    () => inventoryItemsInCategory.length <= 0,
    [inventoryItemsInCategory]
  );
  const displayName = categoryNameToHumanReadableCategoryName(name);

  const altText = useMemo(() => {
    if (equippedQuality) {
      return createEquipmentQualityAltText(equippedQuality);
    }

    return "";
  }, [equippedQuality]);

  const handleClick = useCallback(() => {
    if (!editable) {
      return;
    }

    setInventoryCategory(displayName);
    setInventoryOptions(inventoryItemsInCategory);
    setInventoryAgent(agent);
    setIsInventoryPickerOpen(true);
  }, [
    agent,
    displayName,
    editable,
    inventoryItemsInCategory,
    setInventoryAgent,
    setInventoryCategory,
    setInventoryOptions,
    setIsInventoryPickerOpen,
  ]);

  const isMobile =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia(`(max-width: ${MD - 1}px)`).matches;

  if (isAvailableItemsEmpty) {
    return null;
  }

  if (equippedQuality === undefined && emptySlotImage === undefined) {
    return null;
  }

  if (isChanging) {
    return (
      <div className="agent-inventory--is-changing">
        <Loading spinner small />
      </div>
    );
  }

  return (
    <div className={classnames(!editable && "agent-inventory-item--locked")}>
      <div
        className={classnames(
          "icon icon--emphasize",
          editable && "icon--available-item"
        )}
        data-quality-id={equippedQuality?.id}
      >
        <Image
          alt={altText}
          className={classnames(editable && "equipped-group__available-item")}
          defaultCursor={!editable}
          icon={equippedQuality?.image ?? emptySlotImage}
          onClick={handleClick}
          tooltipData={{
            description: equippedQuality?.name,
            enhancements: equippedQuality?.enhancements,
            image: equippedQuality?.image ?? emptySlotImage,
            name: displayName,
            secondaryDescription: equippedQuality ? undefined : "&nbsp;",
            smallButtons: isMobile
              ? [
                  {
                    label: "Change",
                    action: () => handleClick(),
                  },
                ]
              : [],
          }}
          tooltipPos="bottom"
          type="small-icon"
        />
      </div>
      {!editable && <LockedSlotIcon classNames="agent-inventory-item--lock" />}
    </div>
  );
}

AgentInventoryItem.displayName = "AgentInventoryItem";
