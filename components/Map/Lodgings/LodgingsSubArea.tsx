import React, { Component, Fragment, SyntheticEvent } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import Interactive, {
  ClickType,
  State as ReactInteractiveState,
} from "react-interactive";

import TippyWrapper from "components/TippyWrapper";
import { ThunkDispatch } from "redux-thunk";
import { IArea, IMappableSetting, ISetting } from "types/map";
import { openModalTooltip } from "actions/modalTooltip";
import { areaToTooltipData, isLodgings } from "features/mapping";
import MapContext from "components/Map/MapContext";

import { IAppState } from "types/app";
import {
  MAP_BASE_URL,
  PLAYER_MARKER_HEIGHT,
  PLAYER_MARKER_WIDTH,
} from "features/mapping/constants";
import Underline from "components/Map/Lodgings/Underline";
import asStateAwareArea from "features/mapping/asStateAwareArea";

export interface Props {
  area: IArea;
  areas?: IArea[];
  avatarImage: string;
  areLodgingsLocked: boolean;
  currentArea?: IArea;
  dispatch: ThunkDispatch<any, any, any>;
  onClick: (_: any, area: IArea) => void;
  onSelect: (area?: IArea) => void;
  selectedArea: IArea | undefined;
  setting: ISetting | undefined;
}

export class LodgingsSubArea extends Component<Props> {
  ref = React.createRef<HTMLDivElement>();

  handleClick = (e: SyntheticEvent<Element, Event>, clickType: ClickType) => {
    const { area, currentArea, onClick } = this.props;
    // Do nothing if we're in this area already
    if (area.id === currentArea?.id) {
      return;
    }

    // If we don't have an onClick, return early
    if (!onClick) {
      return;
    }

    // Iff this was a mouse click, run the onClick callback
    if (clickType === "mouseClick") {
      onClick(e, area);
    }
  };

  handleOpenGateEvent = (_: any) => {
    // no-op
  };

  handleStateChange = ({
    nextState,
    event,
  }: {
    nextState: ReactInteractiveState;
    event: SyntheticEvent<Element, Event>;
  }) => {
    const {
      area,
      areas,
      currentArea,
      dispatch,
      selectedArea,
      onClick,
      onSelect,
      setting,
    } = this.props;
    event.preventDefault(); // Don't propagate

    const { iState } = nextState;

    const isHovering = /hover/.test(iState);

    if (isHovering) {
      onSelect(area);
    } else if (selectedArea === area) {
      onSelect();
    }

    // If we've been tapped, then show the modal
    if (/touchActive/.test(iState)) {
      const tooltipData = areaToTooltipData(
        asStateAwareArea(
          area,
          areas || [],
          setting! as IMappableSetting,
          currentArea
        ),
        currentArea,
        !!setting?.canTravel,
        onClick
      );
      dispatch(openModalTooltip({ ...tooltipData }));
    }
  };

  render() {
    const {
      area,
      areas,
      areLodgingsLocked,
      avatarImage,
      currentArea,
      onClick,
      selectedArea,
      setting,
    } = this.props;

    if (areLodgingsLocked && !isLodgings(area)) {
      return null;
    }

    const areWeHere = currentArea?.id === area.id;
    const isSelected = selectedArea?.areaKey === area.areaKey;

    const tooltipData = areaToTooltipData(
      asStateAwareArea(
        area,
        areas || [],
        setting! as IMappableSetting,
        currentArea
      ),
      currentArea,
      !!setting?.canTravel,
      onClick,
      false
    );

    return (
      <Fragment>
        <div
          className="lodgings-subarea"
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: `${42 + 10 + 10}px`, // width of widest icon plus padding on either side
          }}
        >
          <Interactive
            as="div"
            className={classnames(
              "map__lodgings-button",
              areLodgingsLocked && "map__lodgings-button--locked",
              areWeHere && "map__lodgings-button--you-are-here"
            )}
            style={{
              bottom: "20px",
              right: 0,
            }}
            onClick={this.handleClick}
            onStateChange={this.handleStateChange}
          >
            <TippyWrapper tooltipData={tooltipData}>
              <img
                alt={area.name}
                src={`${MAP_BASE_URL}/lodgings/${area.areaKey}.png`}
                className={classnames(
                  "map__lodgings-button__image",
                  areLodgingsLocked && "map__lodgings-button__image--locked"
                )}
              />
            </TippyWrapper>
            <img
              alt="player marker"
              src={`${MAP_BASE_URL}/playermarkers/${avatarImage}-player-marker.png`}
              height={PLAYER_MARKER_HEIGHT}
              width={PLAYER_MARKER_WIDTH}
              className={classnames(
                "map__lodgings-button__player-marker",
                "map__player-marker",
                areWeHere && "map__player-marker--visible"
              )}
            />
          </Interactive>
          {areLodgingsLocked && isLodgings(area) && (
            <MapContext.Consumer>
              {({ onRequestOpenGateStoryletModal }) => (
                <>
                  <button
                    className="map__lodgings-gate-button"
                    onClick={() => onRequestOpenGateStoryletModal(area)}
                    type="button"
                  >
                    <img
                      src="/img/gate-undecorated.png"
                      alt="Open gate event for this area"
                      className="map__lodgings-gate-icon"
                    />
                  </button>
                </>
              )}
            </MapContext.Consumer>
          )}
          {isSelected && <Underline />}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  myself: {
    character: { avatarImage },
  },
  map: { areas, currentArea, setting },
}: IAppState) => ({
  areas,
  avatarImage,
  currentArea,
  setting,
  areLodgingsLocked: !((areas || []).find(isLodgings)?.unlocked ?? false),
});

export default connect(mapStateToProps)(LodgingsSubArea);
