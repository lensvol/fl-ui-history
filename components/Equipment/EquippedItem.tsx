import React, { useCallback, useMemo } from "react";

import { QUALITY_ID_DUMMY_SHOW_ALL_ITEMS } from "components/Equipment/constants";
import {
  FILTER_ENHANCEMENTS,
  NEW_OUTFIT_BEHAVIOUR,
} from "features/feature-flags";
import { unequipQuality } from "actions/outfit";
import { useQuality as _useQuality } from "actions/storylet";
import classnames from "classnames";
import Image from "components/Image";
import Loading from "components/Loading";

import { ITooltipData } from "components/ModalTooltip/types";
import { PossessionsContextValue } from "components/Possessions/PossessionsContext";

import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";
import { IAppState } from "types/app";
import { OutfitSlotName } from "types/outfit";
import { useIsChangeable } from "components/Equipment/hooks";
import { IQuality } from "types/qualities";
import { useFeature } from "flagged";
import { normalize } from "utils/stringFunctions";
import { createEquipmentQualityAltText } from "utils";
import { EquipmentContextValue } from "./EquipmentContext";

type OwnProps = Pick<EquipmentContextValue, "openUseOrEquipModal"> &
  Pick<
    IQuality,
    | "description"
    | "enhancements"
    | "id"
    | "image"
    | "level"
    | "name"
    | "useEventId"
  > & {
    category: OutfitSlotName;
    doesStoryletStateLockOutfits: boolean;
    areOutfitsLockable: boolean;
  };

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  canChangeOutfit: getCanUserChangeOutfit(state, props),
  isChanging: state.outfit.isChanging,
  outfit: state.outfit,
  selectedEnhancementQualityId: state.equipment.selectedEnhancementQualityId,
  setting: state.map.setting,
});

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps &
  OwnProps &
  RouteComponentProps &
  Pick<PossessionsContextValue, "currentlyInStorylet"> &
  Pick<EquipmentContextValue, "filterString">;

function EquippedItem(props: Props) {
  const {
    canChangeOutfit,
    category,
    currentlyInStorylet,
    description,
    enhancements,
    filterString,
    history,
    id,
    image,
    isChanging,
    level,
    name,
    openUseOrEquipModal,
    outfit,
    selectedEnhancementQualityId,
    setting,
    useEventId,
  } = props;

  const dispatch = useDispatch();

  const canPlayerUseItems = setting?.itemsUsableHere && !currentlyInStorylet;
  const hasNewOutfitBehaviour: boolean = useFeature(
    NEW_OUTFIT_BEHAVIOUR
  ) as boolean;
  const hasUseEventId = !!useEventId;

  const isChangeable = useIsChangeable(category, outfit);

  const handleUnequip = useCallback(() => {
    // Unchangeable items can't be unequipped through the UI
    if (!isChangeable) {
      return;
    }
    dispatch(unequipQuality(id, { autosaveOutfit: !hasNewOutfitBehaviour }));
  }, [dispatch, hasNewOutfitBehaviour, id, isChangeable]);

  const hasFilterEnhancementsFeature = useFeature(FILTER_ENHANCEMENTS);

  const hasSelectedEnhancement = useMemo(() => {
    if (!hasFilterEnhancementsFeature) {
      return true;
    }
    if (selectedEnhancementQualityId === QUALITY_ID_DUMMY_SHOW_ALL_ITEMS) {
      return true;
    }
    return enhancements?.find(
      (e) => e.qualityId === selectedEnhancementQualityId
    );
  }, [
    enhancements,
    hasFilterEnhancementsFeature,
    selectedEnhancementQualityId,
  ]);

  const handleUse = useCallback(
    () => dispatch(_useQuality(id, history)),
    [dispatch, history, id]
  );

  const matchesFilterString = useMemo(
    () => normalize(name).indexOf(normalize(filterString)) >= 0,
    [filterString, name]
  );

  const handleClick = useCallback(() => {
    if (!isChangeable) {
      return;
    }

    if (!canChangeOutfit) {
      return;
    }

    if (!hasUseEventId) {
      handleUnequip();
      return;
    }
    if (!canPlayerUseItems) {
      handleUnequip();
      return;
    }
    openUseOrEquipModal({ id, image, name }, true);
  }, [
    canChangeOutfit,
    canPlayerUseItems,
    handleUnequip,
    hasUseEventId,
    id,
    image,
    isChangeable,
    name,
    openUseOrEquipModal,
  ]);

  const smallButtons = useMemo(() => {
    if (!isChangeable || !canChangeOutfit) {
      return [];
    }
    return [{ label: "Unequip", action: handleUnequip }];
  }, [canChangeOutfit, handleUnequip, isChangeable]);

  const tooltipData = useMemo(() => {
    const data: ITooltipData = {
      enhancements,
      image,
      name,
      level,
      description,
      smallButtons,
    };

    if (hasUseEventId && canPlayerUseItems) {
      data.smallButtons = [
        ...(smallButtons ?? []),
        { label: "Use", action: handleUse },
      ];
    }

    return data;
  }, [
    canPlayerUseItems,
    description,
    enhancements,
    handleUse,
    hasUseEventId,
    image,
    level,
    name,
    smallButtons,
  ]);

  const tooltipTimeout = hasUseEventId && 500;

  const altText = useMemo(
    () =>
      createEquipmentQualityAltText({
        description,
        enhancements,
        name,
      }),
    [description, enhancements, name]
  );

  return (
    <>
      <div
        data-quality-id={id}
        className={classnames(
          "equipped-item",
          // grey it out if it's not enhanced or doesn't match filter string
          (!hasSelectedEnhancement || !matchesFilterString) &&
            "equipped-item--lacks-selected-enhancement"
        )}
      >
        <Image
          key={image}
          type="small-icon"
          icon={image}
          alt={altText}
          onClick={handleClick}
          tooltipData={tooltipData}
          tooltipPos="bottom"
          tooltipTimeout={tooltipTimeout}
          className={classnames(
            "equipped-item__image",
            (!isChangeable || !canChangeOutfit) &&
              "equipped-item__image--unchangeable"
          )}
          defaultCursor={!isChangeable || !canChangeOutfit}
        />
        {isChanging && (
          <div>
            <Loading spinner small margins={false} />
          </div>
        )}
      </div>
    </>
  );
}

EquippedItem.displayName = "EquippedItem";

export default connect(mapStateToProps)(withRouter(EquippedItem));
