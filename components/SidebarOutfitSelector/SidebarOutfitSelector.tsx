import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import Select from "react-select";

import { fetch as fetchCards } from "actions/cards";
import { changeOutfit } from "actions/outfit";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";

import * as DropdownStyles from "components/Equipment/dropdown-styles";
import { compareOutfits } from "components/Equipment/util";
import SidebarOutfitSelectorDisabled from "components/SidebarOutfitSelector/SidebarOutfitSelectorDisabled";
import Title from "components/SidebarOutfitSelector/Title";

import { OUTFIT_TYPE_EXCEPTIONAL } from "constants/outfits";

import { useAppSelector } from "features/app/store";

import getOrderedOutfits from "selectors/outfit/getOrderedOutfits";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";

import { UIRestriction } from "types/myself";

export default function SidebarOutfitSelector() {
  const dispatch = useDispatch();

  const canUserChangeOutfit = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const isExceptionalFriend = useAppSelector(
    (state) => state.fate.isExceptionalFriend
  );
  const outfits = useAppSelector((state) => getOrderedOutfits(state));

  const showPossessionsUI = useAppSelector(
    (state) =>
      !state.myself.uiRestrictions?.find(
        (restriction) => restriction === UIRestriction.Possessions
      )
  );

  const [isChanging, setIsChanging] = useState(false);

  const selectedOutfit = useMemo(
    () => outfits.find((o) => o.selected),
    [outfits]
  );

  const selectedOutfitId = selectedOutfit?.id;

  const onChange = useCallback(
    async (arg: any) => {
      const { value } = arg as { label: string; value: number };

      if (!canUserChangeOutfit) {
        return;
      }

      setIsChanging(true);
      await dispatch(changeOutfit(value, { clearCacheImmediately: false }));
      await dispatch(fetchAvailableStorylets({ setIsFetching: true }));
      await dispatch(fetchCards());
      setIsChanging(false);
    },
    [canUserChangeOutfit, dispatch]
  );

  const choices = useMemo(() => [...outfits].sort(compareOutfits), [outfits]);

  const options = useMemo(
    () =>
      [...choices]
        .filter((c) => c.id !== selectedOutfitId)
        .map((c) => ({
          label: c.name,
          type: c.type,
          value: c.id,
          isDisabled:
            c.type === OUTFIT_TYPE_EXCEPTIONAL && !isExceptionalFriend,
        }))
        .sort((a, b) => {
          if (a.isDisabled === b.isDisabled) {
            return 0;
          }

          if (a.isDisabled) {
            return 1;
          }

          return -1;
        }),
    [choices, isExceptionalFriend, selectedOutfitId]
  );

  if (!showPossessionsUI) {
    return null;
  }

  if (!selectedOutfit) {
    return null;
  }

  if (!canUserChangeOutfit) {
    return <SidebarOutfitSelectorDisabled />;
  }

  return (
    <div
      style={{
        marginRight: "-8px",
      }}
    >
      <Title />
      <Select
        aria-hidden="true"
        onChange={onChange}
        value={{
          label: selectedOutfit.name,
          value: selectedOutfit.id,
          type: selectedOutfit.type,
          isDisabled: false,
        }}
        options={options}
        isClearable={false}
        isDisabled={isChanging}
        isSearchable={false}
        theme={DropdownStyles.theme}
        styles={DropdownStyles.styles}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
}

SidebarOutfitSelector.displayName = "SidebarOutfitSelector";
