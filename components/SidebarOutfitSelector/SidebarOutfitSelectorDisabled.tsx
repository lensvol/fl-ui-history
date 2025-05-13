import React, { SyntheticEvent, useCallback, useMemo } from "react";
import Interactive, { State as ReactInteractiveState } from "react-interactive";
import { useDispatch } from "react-redux";

import { openModalTooltip } from "actions/modalTooltip";

import { DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT } from "components/Equipment/constants";
import Title from "components/SidebarOutfitSelector/Title";
import TippyWrapper from "components/TippyWrapper";

import { useAppSelector } from "features/app/store";

export default function SidebarOutfitSelectorDisabled() {
  const dispatch = useDispatch();
  const outfits = useAppSelector((state) => state.myself.character.outfits);

  const selectedOutfit = useMemo(
    () => outfits.find((o) => o.selected),
    [outfits]
  );

  const tooltipData = useMemo(
    () => ({
      description: DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT,
    }),
    []
  );

  const onStateChange = useCallback(
    ({
      nextState,
      event,
    }: {
      nextState: ReactInteractiveState;
      event: SyntheticEvent<Element, Event>;
    }) => {
      event.preventDefault();

      if (/touch/.test(nextState.iState)) {
        dispatch(openModalTooltip(tooltipData));
      }
    },
    [dispatch, tooltipData]
  );

  if (selectedOutfit === undefined) {
    return null;
  }

  return (
    <div>
      <Title />
      <Interactive as="div" onStateChange={onStateChange}>
        <TippyWrapper tooltipData={tooltipData}>
          <div className="form__control outfit-selector outfit-selector--disabled">
            {selectedOutfit.name}
            <i className="fa fa-lg fa-lock" />
          </div>
        </TippyWrapper>
      </Interactive>
    </div>
  );
}

SidebarOutfitSelectorDisabled.displayName = "SidebarOutfitSelectorDisabled";
