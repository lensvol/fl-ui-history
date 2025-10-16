import React, { useCallback, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import { openModalTooltip } from "actions/modalTooltip";

import { DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT } from "components/Equipment/constants";
import MediaMdUp from "components/Responsive/MediaMdUp";
import TippyWrapper from "components/TippyWrapper";

import { IOutfit } from "types/outfit";

type Props = {
  selectedOutfit: IOutfit;
};

export default function LockedOutfitControls({ selectedOutfit }: Props) {
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);

  const [isTooltipActive, setIsTooltipActive] = useState(false);

  const tooltipData = {
    description: DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT,
  };

  const onClick = useCallback(() => {
    if (isTooltipActive) {
      return;
    }

    dispatch(openModalTooltip(tooltipData));
  }, [dispatch, isTooltipActive, tooltipData]);

  return (
    <>
      <TippyWrapper tooltipData={tooltipData}>
        <div
          className="outfit-controls--locked"
          onBlur={() => setIsTooltipActive(false)}
          onClick={onClick}
          onFocus={() => setIsTooltipActive(true)}
          onKeyUp={onClick}
          onMouseLeave={() => setIsTooltipActive(false)}
          onMouseOver={() => setIsTooltipActive(true)}
          ref={ref}
          role="button"
          tabIndex={0}
        >
          {selectedOutfit.name}
          <i className="fa fa-lg fa-lock" />
        </div>
      </TippyWrapper>
      <MediaMdUp>
        <span className="heading heading--3">Outfit</span>
      </MediaMdUp>
    </>
  );
}

LockedOutfitControls.displayText = "LockedOutfitControls";
