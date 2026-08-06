import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import Select from "react-select";

import { fetch as fetchCards } from "actions/cards";
import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { changeOutfit } from "actions/outfit";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";

import { styles, theme } from "components/Equipment/dropdown-styles";
import SidebarOutfitSelectorDisabled from "components/SidebarOutfitSelector/SidebarOutfitSelectorDisabled";
import Title from "components/SidebarOutfitSelector/Title";

import {
  OUTFIT_TYPE_ENHANCED_EXCEPTIONAL,
  OUTFIT_TYPE_EXCEPTIONAL,
} from "constants/outfits";

import { useAppSelector } from "features/app/store";

import getOrderedOutfits from "selectors/outfits/getOrderedOutfits";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";

import { UIRestriction } from "types/myself";

export default function SidebarOutfitSelector() {
  const dispatch = useDispatch();

  const canUserChangeOutfit = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );
  const outfits = useAppSelector((state) => getOrderedOutfits(state));
  const uiRestrictions = useAppSelector((state) => state.myself.uiRestrictions);

  const isExceptionalFriend =
    subscriptionType === "ExceptionalFriendship" ||
    isDowngradedSubscription(hasSubscription, subscriptionType);

  const isEnhancedExceptionalFriend =
    subscriptionType === "EnhancedExceptionalFriendship";

  const showPossessionsUI =
    uiRestrictions === undefined ||
    !uiRestrictions.find(
      (restriction) => restriction === UIRestriction.Possessions
    );

  const [isChanging, setIsChanging] = useState(false);

  const selectedOutfit = useMemo(
    () => outfits.find((o) => o.selected),
    [outfits]
  );

  const selectedOutfitId = selectedOutfit?.id;

  const onChange = useCallback(
    async (arg: any) => {
      const { value } = arg as {
        label: string;
        value: number;
      };

      if (!canUserChangeOutfit) {
        return;
      }

      setIsChanging(true);
      await dispatch(
        changeOutfit(value, {
          clearCacheImmediately: false,
        })
      );
      await dispatch(
        fetchAvailableStorylets({
          setIsFetching: true,
        })
      );
      await dispatch(fetchCards());
      setIsChanging(false);
    },
    [canUserChangeOutfit, dispatch]
  );

  const options = useMemo(
    () =>
      [...outfits]
        .filter((c) => c.id !== selectedOutfitId)
        .map((c) => ({
          label: c.name,
          type: c.type,
          value: c.id,
          isDisabled:
            !isEnhancedExceptionalFriend &&
            (c.type === OUTFIT_TYPE_ENHANCED_EXCEPTIONAL ||
              (!isExceptionalFriend && c.type === OUTFIT_TYPE_EXCEPTIONAL)),
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
    [
      isEnhancedExceptionalFriend,
      isExceptionalFriend,
      outfits,
      selectedOutfitId,
    ]
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
        components={{
          IndicatorSeparator: () => null,
        }}
        isClearable={false}
        isDisabled={isChanging}
        isSearchable={false}
        onChange={onChange}
        options={options}
        styles={styles}
        theme={theme}
        value={{
          isDisabled: false,
          label: selectedOutfit.name,
          type: selectedOutfit.type,
          value: selectedOutfit.id,
        }}
      />
    </div>
  );
}

SidebarOutfitSelector.displayName = "SidebarOutfitSelector";
