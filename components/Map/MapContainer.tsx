import { getMapModalStyles } from "components/Map/styles";
import { getMapDimensionsForSetting } from "features/mapping";
import getCachedZoomLevelForSetting from "features/mapping/getCachedZoomLevelForSetting";
import React, { Fragment } from "react";
import classnames from "classnames";
import ReactModal from "react-modal";
import { connect } from "react-redux";

import { fetch as fetchCards } from "actions/cards";
import { changeLocation, hideMap, setCurrentArea } from "actions/map";
import TravelFailureModal from "components/TravelFailureModal";

import ActionRefreshContext from "components/ActionRefreshContext";
import MapComponent from "components/Map/MapComponent";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import { IArea, IGateEvent, IMappableSetting } from "types/map";
import { IAppState } from "types/app";

import GateStoryletModal from "components/GateEventModal";
import MediaSmDown from "components/Responsive/MediaSmDown";
import CloseButton from "components/Map/CloseButton";
import MapContext from "components/Map/MapContext";
import ActionRefreshModal from "components/ActionRefreshModal";
import PurchaseFateFromGateEvent from "components/Map/PurchaseFateFromGateEvent";
import wait from "utils/wait";
import ExceptionalFriendModal from "components/ExceptionalFriendModal";
import ExceptionalFriendModalContext from "components/ExceptionalFriendModal/ExceptionalFriendModalContext";
import MapService, { IChangeLocationResponse } from "services/MapService";

interface State {
  cachedMapCenter: number[];
  cachedZoomLevel: number;
  gateEvent?: IGateEvent | undefined;
  isActionRefreshModalOpen: boolean;
  isChangingArea: boolean;
  isDelayingCloseAfterGateEventModalClose: boolean;
  isExceptionalFriendModalOpen: boolean;
  isFetchingUpdatedMapData: boolean;
  isGateStoryletModalOpen: boolean;
  isPurchaseFateModalOpen: boolean;
  isEnhancedRefreshModalOpen: boolean;
  isModalOpen: boolean;
  message?: string | undefined;
}

const MINIMUM_TRAVEL_DURATION_MILLISECONDS = 800;

class MapContainer extends React.Component<Props, State> {
  state = {
    cachedMapCenter: [-1, -1], // default
    cachedZoomLevel: -1, // default
    gateEvent: undefined,
    isActionRefreshModalOpen: false,
    isChangingArea: false,
    isDelayingCloseAfterGateEventModalClose: false,
    isExceptionalFriendModalOpen: false,
    isFetchingUpdatedMapData: false,
    isGateStoryletModalOpen: false,
    isPurchaseFateModalOpen: false,
    isEnhancedRefreshModalOpen: false,
    isModalOpen: false,
    message: undefined,
  };

  componentDidMount = () => {
    const { setting } = this.props;
    const { cachedMapCenter, cachedZoomLevel } = this.state;

    if (setting?.mapRootArea) {
      // If we don't have centre coordinates to re-use, then get the middle of the map we're using and use that
      if (cachedMapCenter[0] < 0 && cachedMapCenter[1] < 0) {
        const { width, height } = getMapDimensionsForSetting(
          setting as IMappableSetting
        );
        this.setState({ cachedMapCenter: [width / 2, height / 2] });
      }
      // Same for cached zoom from previously using the map
      if (cachedZoomLevel < 0) {
        this.setState({
          cachedZoomLevel: getCachedZoomLevelForSetting(
            setting as IMappableSetting
          ),
        });
      }
    }
  };

  handleAfterCloseMap = () => {
    // After the map has closed, reset the flags we use to disable map interaction when delaying closure
    this.setState({
      isChangingArea: false,
      isDelayingCloseAfterGateEventModalClose: false,
    });
  };

  handleAreaClick = async (area: IArea) => {
    const { currentArea, dispatch, isMoving, readonly } = this.props;
    const { isChangingArea, isDelayingCloseAfterGateEventModalClose } =
      this.state;
    const { gateEvent, id, unlocked } = area;

    if (
      isChangingArea || // We're moving, so ignore clicks
      isMoving || // We're waiting for the API to respond
      !currentArea || // We don't know where we are
      area.id === currentArea.id // We're trying to move to where we already are
    ) {
      return;
    }

    // We are in read-only mode; ignore clicks
    if (readonly) {
      return;
    }

    // We have just finished a gate event, and we're waiting a bit before we close the window;
    // don't respond to any clicks
    if (isDelayingCloseAfterGateEventModalClose) {
      return;
    }

    // If we're locked, with a gate storylet, then enter it
    if (!unlocked) {
      if (gateEvent) {
        this.setState({ gateEvent, isGateStoryletModalOpen: true });
      }
    } else {
      const startAt = window.performance.now();

      // Store a reference to this, in case changing area fails and we need to roll back
      const previousArea = currentArea;

      this.setState({ isChangingArea: true });

      // Optimistically move the player's marker to the destination
      dispatch(setCurrentArea(area));

      // Wait for the server response
      const result: Either<IChangeLocationResponse> | VersionMismatch =
        await dispatch(changeLocation(id, { closeMap: false }));

      if (result instanceof VersionMismatch) {
        return;
      }

      // On success, wait for transitions to complete, then hide the map
      if (result instanceof Success) {
        // If we were previously in a no-opp-deck area but we've moved to an opp-deck area, then fetch
        // cards
        if (area.showOps && !currentArea.showOps) {
          dispatch(fetchCards());
        }

        // We want to spend at least 800ms in the window, to allow transitions to settle
        const elapsedTravelTime = window.performance.now() - startAt;
        const travelTimeRemaining =
          MINIMUM_TRAVEL_DURATION_MILLISECONDS - elapsedTravelTime;
        if (travelTimeRemaining > 20) {
          await wait(travelTimeRemaining);
        }

        // Don't set isChangingArea to false here; we will wait until the map has closed

        // We have successfully moved; close up the map
        this.handleRequestCloseMap();
        return;
      }

      // On failure, restore the marker to where we were, and show the message we received
      dispatch(setCurrentArea(previousArea));

      this.setState({
        message: result.message,
        isChangingArea: false,
        isModalOpen: true,
      });
    }
  };

  handleMapWillUnmount = (zoom: number, center: number[]) => {
    this.setState({
      cachedMapCenter: center,
      cachedZoomLevel: zoom,
    });
  };

  handleOpenActionRefreshModal = () => {
    this.setState({ isActionRefreshModalOpen: true });
  };

  handleOpenPurchaseFateModal = () => {
    this.setState({ isPurchaseFateModalOpen: true });
  };

  handleRequestCloseActionRefreshModal = () => {
    this.setState({ isActionRefreshModalOpen: false });
  };

  handleOpenEnhancedRefreshModal = () => {
    this.setState({ isEnhancedRefreshModalOpen: true });
  };

  handleRequestCloseEnhancedRefreshModal = () => {
    this.setState({ isEnhancedRefreshModalOpen: false });
  };

  handleRequestCloseExceptionalFriendModal = async (
    didUserSubscribe: boolean
  ) => {
    const { gateEvent, isGateStoryletModalOpen } = this.state;
    // Close the modal
    this.setState({ isExceptionalFriendModalOpen: false });

    // If the user actually subscribed from within the modal, we need to update the map and gate event
    if (didUserSubscribe) {
      this.setState({ isFetchingUpdatedMapData: true });

      const result = await new MapService().fetch();

      if (result instanceof Success) {
        const {
          data: { areas },
        } = result;
        // If the gate event modal is open and has gate event data, update state
        if (isGateStoryletModalOpen && gateEvent) {
          // We need to cast to IGateEvent because TS thinks gateEvent is a 'never'
          const gateEventID = (gateEvent as unknown as IGateEvent).id;
          const gatedArea = (areas as IArea[]).find(
            (area) => area.gateEvent?.id === gateEventID
          );
          if (gatedArea) {
            this.setState({ gateEvent: gatedArea.gateEvent });
          }
        }
        this.setState({ isFetchingUpdatedMapData: false });
      }
    }
  };

  handleRequestCloseFailureModal = () => {
    this.setState((s) => ({ ...s, isModalOpen: false }));
  };

  handleRequestCloseMap = () => {
    const { dispatch } = this.props;
    dispatch(hideMap());
  };

  handleRequestOpenGateStorylet = (area: IArea) => {
    const { unlocked, gateEvent } = area;
    if (unlocked) {
      return;
    }

    // Try beginning the storylet
    this.setState({ gateEvent, isGateStoryletModalOpen: true });
  };

  handleRequestCloseGateStorylet = async (shouldAutoClose?: boolean) => {
    const { dispatch } = this.props;

    this.setState(
      {
        isGateStoryletModalOpen: false,
        isDelayingCloseAfterGateEventModalClose: !!shouldAutoClose,
      },
      async () => {
        if (shouldAutoClose) {
          await wait(500);
          dispatch(hideMap());
        }
      }
    );
  };

  handleRequestClosePurchaseFateModal = () => {
    this.setState({ isPurchaseFateModalOpen: false });
  };

  renderContent = () => {
    const { canOpenMap, fallbackMapPreferred, isMapOpen, isVisible } =
      this.props;

    const {
      cachedMapCenter,
      cachedZoomLevel,
      gateEvent,
      isChangingArea,
      isExceptionalFriendModalOpen,
      isFetchingUpdatedMapData,
      isGateStoryletModalOpen,
    } = this.state;

    return (
      <Fragment>
        <ExceptionalFriendModalContext.Provider
          value={{
            openModal: () =>
              this.setState({ isExceptionalFriendModalOpen: true }),
            onRequestClose: this.handleRequestCloseExceptionalFriendModal,
          }}
        >
          <MediaSmDown>
            {isMapOpen && <CloseButton onClick={this.handleRequestCloseMap} />}
          </MediaSmDown>
          <ReactModal
            onAfterClose={this.handleAfterCloseMap}
            onRequestClose={this.handleRequestCloseMap}
            isOpen={canOpenMap && isVisible}
            closeTimeoutMS={200}
            bodyOpenClassName="ReactModal__Body--open-map"
            className={classnames(
              "modal--map__content",
              fallbackMapPreferred && "modal--map__content--fallback"
            )}
            style={getMapModalStyles(fallbackMapPreferred)}
          >
            <MapContext.Provider
              value={{
                isGateStoryletModalOpen,
                onRequestOpenGateStoryletModal:
                  this.handleRequestOpenGateStorylet,
                onRequestCloseGateStoryletModal:
                  this.handleRequestCloseGateStorylet,
              }}
            >
              <MapComponent
                initialCenter={cachedMapCenter}
                initialZoom={cachedZoomLevel}
                isChangingArea={isChangingArea}
                onAreaClick={this.handleAreaClick}
                onWillUnmount={this.handleMapWillUnmount}
              />
            </MapContext.Provider>
          </ReactModal>
          <GateStoryletModal
            isBeingUpdated={isFetchingUpdatedMapData}
            isOpen={isGateStoryletModalOpen}
            gateEvent={gateEvent}
            onRequestClose={this.handleRequestCloseGateStorylet}
          />

          <ExceptionalFriendModal
            isOpen={isExceptionalFriendModalOpen}
            onRequestClose={this.handleRequestCloseExceptionalFriendModal}
            disableTouchEvents
          />
        </ExceptionalFriendModalContext.Provider>
      </Fragment>
    );
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const {
      isActionRefreshModalOpen,
      isModalOpen,
      isPurchaseFateModalOpen,
      isEnhancedRefreshModalOpen,
      message,
    } = this.state;

    return (
      <ActionRefreshContext.Provider
        value={{
          onOpenActionRefreshModal: this.handleOpenActionRefreshModal,
          onOpenPurchaseFateModal: this.handleOpenPurchaseFateModal,
          onOpenEnhancedRefreshModal: this.handleOpenEnhancedRefreshModal,
        }}
      >
        <Fragment>
          {this.renderContent()}
          <TravelFailureModal
            isOpen={isModalOpen}
            message={message}
            onRequestClose={this.handleRequestCloseFailureModal}
            disableTouchEvents
          />
          <ActionRefreshModal
            isOpen={isActionRefreshModalOpen}
            onRequestClose={this.handleRequestCloseActionRefreshModal}
            overlayClassName="modal--map-action-refresh__overlay modal--map-action-refresh__overlay"
            disableTouchEvents
          />
          <ActionRefreshModal
            isOpen={isEnhancedRefreshModalOpen}
            onRequestClose={this.handleRequestCloseEnhancedRefreshModal}
            overlayClassName="modal--map-action-refresh__overlay"
            disableTouchEvents
          />
          <PurchaseFateFromGateEvent
            isModalOpen={isPurchaseFateModalOpen}
            onRequestClose={this.handleRequestClosePurchaseFateModal}
            style={{
              overlay: {
                zIndex: 20000,
              },
            }}
            disableTouchEvents
          />
        </Fragment>
      </ActionRefreshContext.Provider>
    );
  }
}

const mapStateToProps = ({
  map: { currentArea, fallbackMapPreferred, isMoving, isVisible, setting },
}: IAppState) => ({
  currentArea,
  fallbackMapPreferred,
  isMoving,
  isVisible,
  canOpenMap: setting?.canOpenMap ?? false,
  isMapOpen: (setting?.canOpenMap ?? false) && isVisible,
  readonly: !setting?.canTravel,
  setting,
});

interface OwnProps {
  dispatch: Function; // eslint-disable-line @typescript-eslint/ban-types
}

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = OwnProps & StateProps;

export default connect(mapStateToProps)(MapContainer);
