import { openModalTooltip } from 'actions/modalTooltip';
import React, {
  SyntheticEvent,
  useCallback,
  useMemo,
} from 'react';
import Interactive, { State as ReactInteractiveState } from 'react-interactive';
import TippyWrapper from 'components/TippyWrapper';
import { connect, useDispatch } from 'react-redux';

import getOrderedOutfits from 'selectors/outfit/getOrderedOutfits';
import { DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT } from 'components/Equipment/constants';
import { IAppState } from 'types/app';

import Title from './Title';

export function SidebarOutfitSelectorDisabled({ outfits }: Props) {
  const dispatch = useDispatch();

  const selectedOutfit = useMemo(() => outfits.find(o => o.selected), [outfits]);

  const tooltipData = useMemo(() => ({
    description: DISABLED_OUTFIT_CHANGE_EXPLANATORY_TEXT,
  }), []);

  const onStateChange = useCallback(({ nextState, event }: {
    nextState: ReactInteractiveState,
    event: SyntheticEvent<Element, Event>,
  }) => {
    event.preventDefault();
    if (/touch/.test(nextState.iState)) {
      dispatch(openModalTooltip(tooltipData));
    }
  }, [
    dispatch,
    tooltipData,
  ]);

  if (selectedOutfit === undefined) {
    return null;
  }

  return (
    <div>
      <Title />
      <Interactive
        as="div"
        onStateChange={onStateChange}
      >
        <TippyWrapper tooltipData={tooltipData}>
          <div
            className="form__control outfit-selector outfit-selector--disabled"
          >
            {selectedOutfit.name}
            <i className="fa fa-lg fa-lock" />
          </div>
        </TippyWrapper>
      </Interactive>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  outfits: getOrderedOutfits(state),
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SidebarOutfitSelectorDisabled);