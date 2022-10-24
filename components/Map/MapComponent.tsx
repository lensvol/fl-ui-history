import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { LeafletEvent, ZoomAnimEvent } from "leaflet";

import "leaflet/dist/leaflet.css";

import { mapClicked, mapZoomEnd } from "actions/mapAdmin";
import { ThunkDispatch } from "redux-thunk";
import getIsPlayerInLimbo from "selectors/map/getIsPlayerInLimbo";
import { IArea, IMappableSetting, IStateAwareArea } from "types/map";
import { IAppState } from "types/app";

import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";

import { isDistrict } from "features/mapping";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";

import asStateAwareArea from "features/mapping/asStateAwareArea";
import FallbackMap from "components/Map/FallbackMap";
import loadAndDrawMapSprites from "features/mapping/loadAndDrawMapSprites";
import { spriteLoaderProgress } from "actions/spriteLoader";
import isWebGLSupported from "features/startup/isWebGLSupported";
import Limbo from "./Limbo";
import PixiMap from "./PixiMap";
import SelectedAreaContext from "./SelectedAreaContext";
import Lodgings from "./Lodgings";

export interface State {
  center: number[];
  isModalTooltipOpen: boolean;
  selectedArea?: IStateAwareArea;
  tooltipData?: any;
  zoomLevel: number;
}

export class MapComponent extends Component<Props, State> {
  static displayName = "MapComponent";

  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      center: props.initialCenter,
      isModalTooltipOpen: false,
      zoomLevel: props.initialZoom,
    };
  }

  componentDidMount(): void {
    const { areas, dispatch, fallbackMapPreferred, setting } = this.props;

    if (!setting || !setting.mapRootArea?.areaKey) {
      return;
    }

    // Load map sprites
    if (!fallbackMapPreferred) {
      // Load sprites
      loadAndDrawMapSprites(
        areas ?? [],
        setting as IMappableSetting,
        ({ progress }) => dispatch(spriteLoaderProgress(progress))
      );
    }
  }

  /**
   * Before unmounting, tell our parent what the map's centre & zoom were when we shut down
   */
  componentWillUnmount(): void {
    const { onWillUnmount } = this.props;
    const { center, zoomLevel } = this.state;
    onWillUnmount(zoomLevel, center);
  }

  // noinspection JSUnusedLocalSymbols
  handleAreaClick = async (e: any, area: IArea) => {
    const { onAreaClick } = this.props;
    // Run the parent callback
    await onAreaClick(area);
  };

  handleAreaSelect = (area?: IArea) => {
    const { areas, currentArea, setting } = this.props;
    if (!area) {
      this.setState({ selectedArea: area });
      return;
    }
    const stateAwareArea = asStateAwareArea(
      area,
      areas || [],
      setting as IMappableSetting,
      currentArea
    );
    if (!stateAwareArea.isLit) {
      this.setState({ selectedArea: undefined });
      return;
    }
    this.setState({ selectedArea: stateAwareArea });
  };

  handleClick = ({ latlng }: { latlng: any }) => {
    const { dispatch } = this.props;
    dispatch(mapClicked(latlng.lng, latlng.lat));
  };

  handleHitboxClick = () => {
    /* no-op */
  };

  handleMoveEnd = (e: LeafletEvent) => {
    const mapCenter = e.target.getCenter();
    const zoomLevel = e.target.getZoom();
    this.setState({
      zoomLevel,
      center: [mapCenter.lng, mapCenter.lat],
    });
  };

  handleOpenModalTooltip = (tooltipData: any) => {
    this.setState({
      tooltipData,
      isModalTooltipOpen: true,
    });
  };

  handleRequestCloseModalTooltip = (_: any) => {
    // Close the modal
    this.setState({
      isModalTooltipOpen: false,
      tooltipData: undefined,
    });

    // Clear the selected area
    this.handleAreaSelect();
  };

  handleZoomEnd = (e: ZoomAnimEvent) => {
    const { dispatch, fallbackMapPreferred, setting } = this.props;
    const { selectedArea } = this.state;
    const zoomLevel = e.target.getZoom();
    this.setState({ zoomLevel });
    dispatch(mapZoomEnd(zoomLevel));

    // If we have zoomed in while moused over an area's hitbox, then we need to automatically
    // deselect it
    if (
      setting &&
      setting.mapRootArea?.areaKey &&
      zoomLevel >=
        getMinimumZoomLevelForDestinations(setting as IMappableSetting) &&
      isDistrict(selectedArea) &&
      !fallbackMapPreferred
    ) {
      this.handleAreaSelect();
    }
  };

  render() {
    const {
      currentArea,
      fallbackMapPreferred,
      initialCenter,
      initialZoom,
      isPlayerInLimbo,
    } = this.props;

    const { isModalTooltipOpen, selectedArea, tooltipData, zoomLevel } =
      this.state;

    if (!currentArea) {
      return null;
    }

    // One final check as we render to try and funnel the user to the compatibility map rather than crashing
    const shouldWeShowTheFallbackMap =
      fallbackMapPreferred || !isWebGLSupported();

    return (
      <MapModalTooltipContext.Provider
        value={{
          openModalTooltip: this.handleOpenModalTooltip,
          onRequestClose: () => {
            /* no-op */
          },
        }}
      >
        <SelectedAreaContext.Provider value={{ selectedArea }}>
          {shouldWeShowTheFallbackMap ? (
            <FallbackMap
              currentArea={currentArea}
              initialCenter={initialCenter}
              initialZoom={initialZoom}
              onAreaClick={this.handleAreaClick}
              onAreaSelect={this.handleAreaSelect}
              onClick={this.handleClick}
              onHitboxClick={this.handleHitboxClick}
              onMoveEnd={this.handleMoveEnd}
              onZoomEnd={this.handleZoomEnd}
              selectedArea={selectedArea}
              zoomLevel={zoomLevel}
            />
          ) : (
            <Fragment>
              <PixiMap
                currentArea={currentArea}
                initialCenter={initialCenter}
                initialZoom={initialZoom}
                onAreaClick={this.handleAreaClick}
                onAreaSelect={this.handleAreaSelect}
                onClick={this.handleClick}
                onHitboxClick={this.handleHitboxClick}
                onMoveEnd={this.handleMoveEnd}
                onZoomEnd={this.handleZoomEnd}
                selectedArea={selectedArea}
                zoomLevel={zoomLevel}
              />

              {isPlayerInLimbo && <Limbo />}

              <Lodgings
                onAreaClick={this.handleAreaClick}
                onAreaSelect={this.handleAreaSelect}
                selectedArea={selectedArea}
              />

              <ModalTooltip
                modalIsOpen={isModalTooltipOpen}
                onRequestClose={this.handleRequestCloseModalTooltip}
                tooltipData={tooltipData}
                disableTouchEvents
              />
            </Fragment>
          )}
        </SelectedAreaContext.Provider>
      </MapModalTooltipContext.Provider>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  areas: state.map.areas,
  fallbackMapPreferred: state.map.fallbackMapPreferred,
  currentArea: state.map.currentArea,
  setting: state.map.setting,
  isPlayerInLimbo: getIsPlayerInLimbo(state),
});

export interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<any, any, any>;
  initialCenter: number[];
  initialZoom: number;
  isChangingArea: boolean;
  onAreaClick: (area: IArea) => Promise<void>;
  onWillUnmount: (zoom: number, center: number[]) => void;
}

export default connect(mapStateToProps)(MapComponent);
