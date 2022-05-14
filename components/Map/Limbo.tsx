import React, {
  useCallback,
  useMemo,
} from 'react';
import classnames from 'classnames';
import Interactive from "react-interactive";
import { connect } from 'react-redux';

import TippyWrapper from 'components/TippyWrapper';
import { openModalTooltip } from 'actions/modalTooltip';
import {
  areaToTooltipData,
  isUnterzeeSetting,
} from 'features/mapping';
import asStateAwareArea from 'features/mapping/asStateAwareArea';
import { MAP_BASE_URL } from 'features/mapping/constants';

import { IAppState } from 'types/app';
import { IMappableSetting } from 'types/map';

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
};

const noop = () => {
};

export function Limbo(props: Props) {
  const {
    areas,
    currentArea,
    dispatch,
    setting,
  } = props;

  const tooltipData = useMemo(() => ({
    ...areaToTooltipData(
      asStateAwareArea(
        currentArea!,
        areas || [],
        setting! as IMappableSetting,
        currentArea,
      ),
      currentArea,
      !!setting?.canTravel,
      noop,
      true,
    ),
    name: `Your location: ${currentArea?.name}`,
  }), [
    areas,
    currentArea,
    setting,
  ]);

  const handleStateChange = useCallback(({ nextState, event }) => {
    event.preventDefault();
    const { iState } = nextState;

    if (/touchActive/.test(iState)) {
      dispatch(openModalTooltip(tooltipData));
    }
  }, [dispatch, tooltipData]);

  return (
    <div
      className={classnames(
        'map-limbo',
        (isUnterzeeSetting(setting)) && 'map-limbo--unterzee',
      )}
    >
      <PlayerMarker {...props} />
      <Interactive
        as="div"
        onStateChange={handleStateChange}
      >
        <TippyWrapper
          tooltipData={tooltipData}
        >
          <img
            alt="In limbo"
            className="map-limbo__signpost"
            src={"/map/signpost-icon.png"}
          />
        </TippyWrapper>
      </Interactive>
    </div>
  )
}

function PlayerMarker({ avatarImage }: Props) {
  return (
    <img
      alt="Player marker"
      className="map-limbo__player-marker"
      src={`${MAP_BASE_URL}/playermarkers/${avatarImage}-player-marker.png`}
    />
  );
}

const mapStateToProps = ({
  map: { areas, currentArea, setting },
  myself: {
    character: { avatarImage },
  },
}: IAppState) => ({
  areas,
  avatarImage,
  currentArea,
  setting,
});

export default connect(mapStateToProps)(Limbo);