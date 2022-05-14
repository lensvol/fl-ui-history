import { DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT } from 'components/Equipment/constants';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';

import { openModalTooltip } from 'actions/modalTooltip';
import { IOutfit } from 'types/outfit';
import TippyWrapper from 'components/TippyWrapper';

export function LockedOutfitControls({ selectedOutfit }: { selectedOutfit: IOutfit }) {
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);

  const [isTooltipActive, setIsTooltipActive] = useState(false);

  const tooltipData = useMemo(() => ({
    description: DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT,
  }), []);

  const onClick = useCallback(() => {
    if (isTooltipActive) {
      return;
    }
    dispatch(openModalTooltip(tooltipData));
  }, [
    dispatch,
    isTooltipActive,
    tooltipData,
  ]);

  return (
    <>
      <TippyWrapper
        tooltipData={tooltipData}
      >
        <div
          className="outfit-controls--locked"
          onBlur={() => setIsTooltipActive(false)}
          onFocus={() => setIsTooltipActive(true)}
          onMouseLeave={() => setIsTooltipActive(false)}
          onMouseOver={() => setIsTooltipActive(true)}
          onClick={onClick}
          onKeyUp={onClick}
          ref={ref}
          role="button"
          tabIndex={0}
        >
          {selectedOutfit.name}
          <i className="fa fa-lg fa-lock" />
        </div>
      </TippyWrapper>
      <span className="heading heading--3">
        Outfit
      </span>
    </>
  );
}

export default connect()(LockedOutfitControls);