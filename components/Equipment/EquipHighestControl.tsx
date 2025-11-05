import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import { equipHighest } from "actions/outfit";

import { EQUIP_HIGHEST_QUALITY_FILTER_IDS } from "constants/possessions";

import { useAppSelector } from "features/app/store";

import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";

export default function EquipHighestControl() {
  const dispatch = useDispatch();

  const canChangeOutfit = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const selectedEnhancementQualityId = useAppSelector(
    (state) => state.equipment.selectedEnhancementQualityId
  );

  const equipHighestDisabled = useMemo(() => {
    return (
      canChangeOutfit &&
      !EQUIP_HIGHEST_QUALITY_FILTER_IDS.some(
        (id) => id === selectedEnhancementQualityId
      )
    );
  }, [canChangeOutfit, selectedEnhancementQualityId]);

  const doEquipHighest = useCallback(() => {
    dispatch(equipHighest(selectedEnhancementQualityId, true));
  }, [dispatch, selectedEnhancementQualityId]);

  return (
    <>
      <button
        className="button button--primary button--no-margin"
        disabled={equipHighestDisabled}
        onClick={doEquipHighest}
      >
        Equip Highest
      </button>
    </>
  );
}

EquipHighestControl.displayName = "EquipHighestControl";
