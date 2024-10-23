import { EquipmentContextValue } from "components/Equipment/EquipmentContext";
import React, { Fragment, useCallback, useMemo } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { equipQuality } from "actions/outfit";
import { useQuality as _useQuality } from "actions/storylet";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";
import getIsEquipped from "selectors/possessions/getIsEquipped";
import { IAppState } from "types/app";
import { IEnhancement } from "types/qualities";
import Image from "components/Image";
import { createEquipmentQualityAltText } from "utils";

function AvailableItem(props: Props) {
  const {
    canChangeOutfit,
    currentlyInStorylet,
    description,
    enhancements,
    history,
    id,
    image,
    isChanging,
    isEquipped,
    itemsUsableHere,
    level,
    name,
    openUseOrEquipModal,
    setting,
    useEventId,
  } = props;

  const dispatch = useDispatch();

  const canPlayerUseItems = useMemo(() => {
    return (setting?.itemsUsableHere ?? false) && !currentlyInStorylet;
  }, [currentlyInStorylet, setting]);

  const handleEquip = useCallback(() => {
    if (isChanging) {
      return;
    }

    dispatch(equipQuality(id));
  }, [dispatch, id, isChanging]);

  const handleUse = useCallback(() => {
    _useQuality(id, history)(dispatch);
  }, [dispatch, history, id]);

  const handleClick = useCallback(() => {
    // No use event ID associated with this item; just equip it
    if (useEventId === undefined) {
      if (!canChangeOutfit) {
        return;
      }

      handleEquip();

      return;
    }

    // Player can't use items right now, so just equip it
    if (!canPlayerUseItems) {
      if (!canChangeOutfit) {
        return;
      }

      handleEquip();

      return;
    }

    // Open the modal to ask what we want to do about it
    openUseOrEquipModal({ id, name, image }, false);
  }, [
    canChangeOutfit,
    canPlayerUseItems,
    handleEquip,
    id,
    image,
    name,
    openUseOrEquipModal,
    useEventId,
  ]);

  const smallButtons = useMemo(() => {
    // Items might be equippable
    const buttons = canChangeOutfit
      ? [
          {
            label: "Equip",
            action: handleEquip,
          },
        ]
      : [];

    // Sometimes they're also usable
    if (!!useEventId && !currentlyInStorylet) {
      const useButton = {
        label: "Use",
        action: handleUse,
      };

      buttons.push(useButton);
    }

    return buttons;
  }, [
    canChangeOutfit,
    currentlyInStorylet,
    handleEquip,
    handleUse,
    useEventId,
  ]);

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
    if (!useEventId) {
      return undefined;
    }

    if (currentlyInStorylet) {
      return (
        "<span class='item-use-warning'>" +
        "You're in a storylet at the moment - you must finish it before you can use this item." +
        "</span>"
      );
    }

    return undefined;
  }, [currentlyInStorylet, useEventId]);

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
          className={classnames("equipped-group__available-item")}
          icon={image}
          alt={altText}
          type="small-icon"
          onClick={handleClick}
          tooltipData={tooltipData}
          defaultCursor={!canChangeOutfit}
        />
        <span className="js-item-value icon__value">
          {(isEquipped ? level - 1 : level).toLocaleString("en-GB")}
        </span>
      </div>
    </Fragment>
  );
}

AvailableItem.displayName = "AvailableItem";

type OwnProps = {
  currentlyInStorylet: boolean;
  description: string;
  doesStoryletStateLockOutfits: boolean;
  enhancements?: IEnhancement[];
  id: number;
  image: string;
  level: number;
  name: string;
  useEventId?: number;
};

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  canChangeOutfit: getCanUserChangeOutfit(state, props),
  isChanging: state.outfit.isChanging,
  isEquipped: getIsEquipped(state, props),
  itemsUsableHere: state.map.setting?.itemsUsableHere,
  setting: state.map.setting,
});

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = OwnProps &
  StateProps &
  RouteComponentProps &
  Pick<EquipmentContextValue, "openUseOrEquipModal">;

export default connect(mapStateToProps)(withRouter(AvailableItem));
