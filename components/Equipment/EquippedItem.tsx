import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { unequipQuality } from "actions/outfit";
import { useQuality as _useQuality } from "actions/storylet";

import { QUALITY_ID_DUMMY_SHOW_ALL_ITEMS } from "components/Equipment/constants";
import { EquipmentContextValue } from "components/Equipment/EquipmentContext";
import { useIsChangeable } from "components/Equipment/hooks";
import Image from "components/Image";
import Loading from "components/Loading";
import { ITooltipData } from "components/ModalTooltip/types";
import { PossessionsContextValue } from "components/Possessions/PossessionsContext";

import { useAppSelector } from "features/app/store";

import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";

import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

import { normalize } from "utils/stringFunctions";
import { createEquipmentQualityAltText } from "utils";

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
  };

type Props = OwnProps &
  RouteComponentProps &
  Pick<PossessionsContextValue, "currentlyInStorylet"> &
  Pick<EquipmentContextValue, "filterString">;

function EquippedItem(props: Props) {
  const {
    category,
    currentlyInStorylet,
    description,
    enhancements,
    filterString,
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
  const outfit = useAppSelector((state) => state.outfit);
  const selectedEnhancementQualityId = useAppSelector(
    (state) => state.equipment.selectedEnhancementQualityId
  );
  const itemsUsableHere = useAppSelector(
    (state) => state.map.setting?.itemsUsableHere
  );

  const dispatch = useDispatch();

  const canPlayerUseItems = itemsUsableHere && !currentlyInStorylet;
  const hasUseEventId = !!useEventId;

  const isChangeable = useIsChangeable(category, outfit);

  const handleUnequip = useCallback(() => {
    // Unchangeable items can't be unequipped through the UI
    if (!isChangeable) {
      return;
    }

    dispatch(unequipQuality(id));
  }, [dispatch, id, isChangeable]);

  const hasSelectedEnhancement = useMemo(() => {
    if (selectedEnhancementQualityId === QUALITY_ID_DUMMY_SHOW_ALL_ITEMS) {
      return true;
    }

    return enhancements?.find(
      (e) => e.qualityId === selectedEnhancementQualityId
    );
  }, [enhancements, selectedEnhancementQualityId]);

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

    return [
      {
        label: "Unequip",
        action: handleUnequip,
      },
    ];
  }, [canChangeOutfit, handleUnequip, isChangeable]);

  const tooltipData = useMemo(() => {
    const data: ITooltipData = {
      description,
      enhancements,
      image,
      level,
      name,
      smallButtons,
    };

    if (hasUseEventId && canPlayerUseItems) {
      data.smallButtons = [
        ...(smallButtons ?? []),
        {
          label: "Use",
          action: handleUse,
        },
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
        {outfit.isChanging && (
          <div>
            <Loading spinner small margins={false} />
          </div>
        )}
      </div>
    </>
  );
}

EquippedItem.displayName = "EquippedItem";

export default withRouter(EquippedItem);
