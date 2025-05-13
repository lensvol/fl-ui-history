import React, { Fragment, useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { equipQuality } from "actions/outfit";
import { useQuality as _useQuality } from "actions/storylet";

import getAgentNames from "components/Agents/getAgentNames";
import { EquipmentContextValue } from "components/Equipment/EquipmentContext";
import Image from "components/Image";

import { useAppSelector } from "features/app/store";

import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";
import getIsEquipped from "selectors/possessions/getIsEquipped";

import { IEnhancement } from "types/qualities";

import { createEquipmentQualityAltText } from "utils";

function AvailableItem(props: Props) {
  const {
    currentlyInStorylet,
    description,
    enhancements,
    history,
    id,
    image,
    level,
    name,
    openUseOrEquipModal,
    useEventId,
  } = props;

  const canChangeOutfit = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const isChanging = useAppSelector((state) => state.outfit.isChanging);
  const isEquipped = useAppSelector((state) => getIsEquipped(state, props));
  const itemsUsableHere = useAppSelector(
    (state) => state.map.setting?.itemsUsableHere
  );

  const agents = useAppSelector((state) => state.agents.agents);
  const borrowers = agents.filter((a) =>
    a.inventory.map((i) => i.id).includes(id)
  );

  const dispatch = useDispatch();

  // these agents are away on a plot
  const workingAgents = borrowers.filter((b) => b.plot);

  const isLocked = level <= workingAgents.length;
  const unequippedCount = level - (isEquipped ? 1 : 0);

  const isEquippable = canChangeOutfit && !isLocked && !isEquipped;

  const canPlayerUseItems = useMemo(() => {
    return (
      (itemsUsableHere ?? false) &&
      !currentlyInStorylet &&
      useEventId !== undefined
    );
  }, [currentlyInStorylet, itemsUsableHere, useEventId]);

  const handleEquip = useCallback(() => {
    if (isChanging || !isEquippable) {
      return;
    }

    dispatch(equipQuality(id, level <= borrowers.length));
  }, [borrowers, dispatch, id, isChanging, isEquippable, level]);

  const handleUse = useCallback(() => {
    _useQuality(id, history)(dispatch);
  }, [dispatch, history, id]);

  const handleClick = useCallback(() => {
    // Player can't do anything with this item
    if (!canPlayerUseItems && !isEquippable) {
      return;
    }

    if (canPlayerUseItems) {
      // Open the modal to ask what we want to do about it
      openUseOrEquipModal({ id, name, image }, false);
    } else {
      // Player can't use items right now, so just equip it
      handleEquip();
    }
  }, [
    canPlayerUseItems,
    handleEquip,
    id,
    image,
    isEquippable,
    name,
    openUseOrEquipModal,
  ]);

  const smallButtons = useMemo(() => {
    // Items might be equippable
    const buttons = isEquippable
      ? [
          {
            label: "Equip",
            action: handleEquip,
          },
        ]
      : [];

    // Sometimes they're also usable
    if (canPlayerUseItems) {
      const useButton = {
        label: "Use",
        action: handleUse,
      };

      buttons.push(useButton);
    }

    return buttons;
  }, [canPlayerUseItems, handleEquip, handleUse, isEquippable]);

  const itemUsabilityStateClassName = useMemo(() => {
    if (!useEventId) {
      return undefined;
    }

    if (!itemsUsableHere) {
      return "icon--usable icon--blocked";
    }

    if (currentlyInStorylet) {
      return "icon--usable icon--blocked";
    }

    return "icon--usable";
  }, [currentlyInStorylet, itemsUsableHere, useEventId]);

  const secondaryDescription = useMemo(() => {
    if (useEventId && currentlyInStorylet) {
      return (
        "<span class='item-use-warning'>" +
        "You're in a storylet at the moment - you must finish it before you can use this item." +
        "</span>"
      );
    }

    if (useEventId || isEquipped || level === 0) {
      // use by agents is irrelevant
      return undefined;
    }

    // we can equip an item without affecting anyone else's inventory
    if (level > borrowers.length) {
      return undefined;
    }

    if (isLocked) {
      // all copies are off-limits
      return `You cannot equip this item because it is currently equipped by ${getAgentNames(workingAgents)}.`;
    }

    // eqiupping this item means taking it away from someone else
    const freeAgents = borrowers.filter((b) => !b.plot);

    if (freeAgents.length === 0) {
      // should be unreachable: previous checks eliminate this possibility
      return "You do not have this item.";
    }

    const freeAgent = freeAgents[0];
    const resortedAgents = [
      freeAgent,
      ...borrowers.filter((b) => b.id !== freeAgent.id),
    ];

    // you've loaned out all copies of this item to your agents
    return `This item is currently equipped by ${getAgentNames(resortedAgents)}.`;
  }, [
    borrowers,
    currentlyInStorylet,
    isEquipped,
    isLocked,
    level,
    useEventId,
    workingAgents,
  ]);

  // Build the tooltip data, including the buttons
  const tooltipData = {
    description,
    enhancements,
    id,
    image,
    level,
    name,
    useEventId,
    secondaryDescription,
    smallButtons,
  };

  const altText = useMemo(
    () =>
      createEquipmentQualityAltText({
        description,
        enhancements,
        name,
        secondaryDescription,
      }),
    [description, enhancements, name, secondaryDescription]
  );

  // If this is an equipped AvailableItem and we only have 1, then we shouldn't show it
  if (isEquipped && level <= 1) {
    return null;
  }

  return (
    <Fragment>
      <div
        className={classnames(
          "icon icon--emphasize icon--available-item",
          !canChangeOutfit && "icon--disabled",
          itemUsabilityStateClassName
        )}
        data-quality-id={id}
      >
        <Image
          className={classnames(
            "equipped-group__available-item",
            isLocked && "icon--locked"
          )}
          icon={image}
          alt={altText}
          type="small-icon"
          onClick={handleClick}
          tooltipData={tooltipData}
          defaultCursor={!canPlayerUseItems && !isEquippable}
        />
        <span className="js-item-value icon__value">
          {unequippedCount.toLocaleString("en-GB")}
        </span>
      </div>
    </Fragment>
  );
}

AvailableItem.displayName = "AvailableItem";

type OwnProps = {
  currentlyInStorylet: boolean;
  description: string;
  enhancements?: IEnhancement[];
  id: number;
  image: string;
  level: number;
  name: string;
  useEventId?: number;
};

type Props = OwnProps &
  RouteComponentProps &
  Pick<EquipmentContextValue, "openUseOrEquipModal">;

export default withRouter(AvailableItem);
