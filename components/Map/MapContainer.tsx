import React, { useCallback, useEffect, useMemo, useState } from "react";

import ReactModal from "react-modal";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { fetch as fetchCards } from "actions/cards";
import { changeLocation, hideMap, setCurrentArea } from "actions/map";

import ActionRefreshContext from "components/ActionRefreshContext";
import ActionRefreshModal from "components/ActionRefreshModal";
import ExceptionalFriendModal from "components/ExceptionalFriendModal";
import ExceptionalFriendModalContext from "components/ExceptionalFriendModal/ExceptionalFriendModalContext";
import GateStoryletModal from "components/GateEventModal";
import CloseButton from "components/Map/CloseButton";
import MapComponent from "components/Map/MapComponent";
import MapContext from "components/Map/MapContext";
import PurchaseFateFromGateEvent from "components/Map/PurchaseFateFromGateEvent";
import { getMapModalStyles } from "components/Map/styles";
import MediaSmDown from "components/Responsive/MediaSmDown";
import TravelFailureModal from "components/TravelFailureModal";

import { useAppSelector } from "features/app/store";
import { getMapDimensionsForSetting } from "features/mapping";
import getCachedZoomLevelForSetting from "features/mapping/getCachedZoomLevelForSetting";
import getInitialMapCenter from "features/mapping/getInitialMapCenter";

import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MapService, { IChangeLocationResponse } from "services/MapService";

import { IArea, IGateEvent, IMappableSetting } from "types/map";

import wait from "utils/wait";

const MINIMUM_TRAVEL_DURATION_MILLISECONDS = 800;

export default function MapContainer() {
  const currentArea = useAppSelector((state) => state.map.currentArea);
  const fallbackMapPreferred = useAppSelector(
    (state) => state.map.fallbackMapPreferred
  );
  const isMoving = useAppSelector((state) => state.map.isMoving);
  const isVisible = useAppSelector((state) => state.map.isVisible);
  const setting = useAppSelector((state) => state.map.setting);

  const canOpenMap = useMemo(() => {
    return setting?.canOpenMap ?? false;
    // eslint-disable-next-line
  }, [setting]);

  const isMapOpen = useMemo(() => {
    return (setting?.canOpenMap ?? false) && isVisible;
    // eslint-disable-next-line
  }, [isVisible, setting]);

  const readonly = useMemo(() => {
    return !setting?.canTravel;
    // eslint-disable-next-line
  }, [setting]);

  const dispatch = useDispatch();

  const [cachedMapCenter, setCachedMapCenter] = useState([-1, -1]);
  const [cachedZoomLevel, setCachedZoomLevel] = useState(-1);
  const [gateEvent, setGateEvent] = useState<IGateEvent | undefined>(undefined);
  const [isActionRefreshModalOpen, setIsActionRefreshModalOpen] =
    useState(false);
  const [isChangingArea, setIsChangingArea] = useState(false);
  const [
    isDelayingCloseAfterGateEventModalClose,
    setIsDelayingCloseAfterGateEventModalClose,
  ] = useState(false);
  const [isEnhancedRefreshModalOpen, setIsEnhancedRefreshModalOpen] =
    useState(false);
  const [isExceptionalFriendModalOpen, setIsExceptionalFriendModalOpen] =
    useState(false);
  const [isFetchingUpdatedMapData, setIsFetchingUpdatedMapData] =
    useState(false);
  const [isGateStoryletModalOpen, setIsGateStoryletModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseFateModalOpen, setIsPurchaseFateModalOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    if (didLoad) {
      return;
    }

    setDidLoad(true);

    if (!setting?.mapRootArea) {
      return;
    }

    // If we don't have centre coordinates to re-use, then get the middle of the map we're using and use that
    if (cachedMapCenter[0] < 0 && cachedMapCenter[1] < 0) {
      const { width, height } = getMapDimensionsForSetting(
        setting as IMappableSetting
      );
      const { initPercentX, initPercentY } = getInitialMapCenter(
        setting as IMappableSetting
      );

      setCachedMapCenter([
        (width * initPercentX) / 100.0,
        (-height * initPercentY) / 100.0,
      ]);
    }

    // Same for cached zoom from previously using the map
    if (cachedZoomLevel < 0) {
      setCachedZoomLevel(
        getCachedZoomLevelForSetting(setting as IMappableSetting)
      );
    }
  }, [cachedMapCenter, cachedZoomLevel, didLoad, dispatch, setting]);

  const handleAfterCloseMap = useCallback(() => {
    // After the map has closed, reset the flags we use to disable map interaction when delaying closure
    setIsChangingArea(false);
    setIsDelayingCloseAfterGateEventModalClose(false);
  }, []);

  const handleRequestCloseMap = useCallback(() => {
    dispatch(hideMap());
  }, [dispatch]);

  const handleAreaClick = useCallback(
    async (area: IArea) => {
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
          setGateEvent(gateEvent);
          setIsGateStoryletModalOpen(true);
        }
      } else {
        const startAt = window.performance.now();

        // Store a reference to this, in case changing area fails and we need to roll back
        const previousArea = currentArea;

        setIsChangingArea(true);

        // Optimistically move the player's marker to the destination
        dispatch(setCurrentArea(area));

        // Wait for the server response
        const result: Either<IChangeLocationResponse> | VersionMismatch =
          await (dispatch as Function)(changeLocation(id, { closeMap: false }));

        if (result instanceof VersionMismatch) {
          return;
        }

        // On success, wait for transitions to complete, then hide the map
        if (result instanceof Success) {
          // If we were previously in a no-opp-deck area but we've moved to an opp-deck area, then fetch cards
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
          handleRequestCloseMap();

          return;
        }

        // On failure, restore the marker to where we were, and show the message we received
        dispatch(setCurrentArea(previousArea));

        setIsChangingArea(false);
        setIsModalOpen(true);
        setMessage(result.message);
      }
    },
    [
      currentArea,
      dispatch,
      handleRequestCloseMap,
      isChangingArea,
      isDelayingCloseAfterGateEventModalClose,
      isMoving,
      readonly,
    ]
  );

  const handleMapWillUnmount = useCallback((zoom: number, center: number[]) => {
    setCachedMapCenter(center);
    setCachedZoomLevel(zoom);
  }, []);

  const handleOpenActionRefreshModal = useCallback(() => {
    setIsActionRefreshModalOpen(true);
  }, []);

  const handleOpenPurchaseFateModal = useCallback(() => {
    setIsPurchaseFateModalOpen(true);
  }, []);

  const handleRequestCloseActionRefreshModal = useCallback(() => {
    setIsActionRefreshModalOpen(false);
  }, []);

  const handleOpenEnhancedRefreshModal = useCallback(() => {
    setIsEnhancedRefreshModalOpen(true);
  }, []);

  const handleRequestCloseEnhancedRefreshModal = useCallback(() => {
    setIsEnhancedRefreshModalOpen(false);
  }, []);

  const handleRequestCloseExceptionalFriendModal = useCallback(
    async (didUserSubscribe: boolean) => {
      // Close the modal
      setIsExceptionalFriendModalOpen(false);

      // If the user actually subscribed from within the modal, we need to update the map and gate event
      if (didUserSubscribe) {
        setIsFetchingUpdatedMapData(true);

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
              setGateEvent(gatedArea.gateEvent);
            }
          }

          setIsFetchingUpdatedMapData(false);
        }
      }
    },
    [gateEvent, isGateStoryletModalOpen]
  );

  const handleRequestCloseFailureModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleRequestOpenGateStorylet = useCallback((area: IArea) => {
    const { unlocked, gateEvent } = area;

    if (unlocked) {
      return;
    }

    // Try beginning the storylet
    setGateEvent(gateEvent);
    setIsGateStoryletModalOpen(true);
  }, []);

  const handleRequestCloseGateStorylet = useCallback(
    async (shouldAutoClose?: boolean) => {
      setIsGateStoryletModalOpen(false);
      setIsDelayingCloseAfterGateEventModalClose(!!shouldAutoClose);

      if (shouldAutoClose) {
        await wait(500);

        dispatch(hideMap());
      }
    },
    [dispatch]
  );

  const handleRequestClosePurchaseFateModal = useCallback(() => {
    setIsPurchaseFateModalOpen(false);
  }, []);

  return (
    <ActionRefreshContext.Provider
      value={{
        onOpenActionRefreshModal: handleOpenActionRefreshModal,
        onOpenEnhancedRefreshModal: handleOpenEnhancedRefreshModal,
        onOpenPurchaseFateModal: handleOpenPurchaseFateModal,
      }}
    >
      <ExceptionalFriendModalContext.Provider
        value={{
          onRequestClose: handleRequestCloseExceptionalFriendModal,
          openModal: () => setIsExceptionalFriendModalOpen(true),
        }}
      >
        <MediaSmDown>
          {isMapOpen && <CloseButton onClick={handleRequestCloseMap} />}
        </MediaSmDown>

        <ReactModal
          bodyOpenClassName="ReactModal__Body--open-map"
          className={classnames(
            "modal--map__content",
            fallbackMapPreferred && "modal--map__content--fallback"
          )}
          closeTimeoutMS={200}
          isOpen={canOpenMap && isVisible}
          onAfterClose={handleAfterCloseMap}
          onRequestClose={handleRequestCloseMap}
          style={getMapModalStyles(fallbackMapPreferred)}
        >
          <MapContext.Provider
            value={{
              isGateStoryletModalOpen,
              onRequestCloseGateStoryletModal: handleRequestCloseGateStorylet,
              onRequestOpenGateStoryletModal: handleRequestOpenGateStorylet,
            }}
          >
            <MapComponent
              initialCenter={cachedMapCenter}
              initialZoom={cachedZoomLevel}
              isChangingArea={isChangingArea}
              onAreaClick={handleAreaClick}
              onWillUnmount={handleMapWillUnmount}
            />
          </MapContext.Provider>
        </ReactModal>

        <GateStoryletModal
          isBeingUpdated={isFetchingUpdatedMapData}
          isOpen={isGateStoryletModalOpen}
          gateEvent={gateEvent}
          onRequestClose={handleRequestCloseGateStorylet}
        />

        <ExceptionalFriendModal
          disableTouchEvents
          isOpen={isExceptionalFriendModalOpen}
          onRequestClose={handleRequestCloseExceptionalFriendModal}
        />
      </ExceptionalFriendModalContext.Provider>

      <TravelFailureModal
        disableTouchEvents
        isOpen={isModalOpen}
        message={message}
        onRequestClose={handleRequestCloseFailureModal}
      />

      <ActionRefreshModal
        disableTouchEvents
        isOpen={isActionRefreshModalOpen}
        onRequestClose={handleRequestCloseActionRefreshModal}
        overlayClassName="modal--map-action-refresh__overlay modal--map-action-refresh__overlay"
      />

      <ActionRefreshModal
        disableTouchEvents
        isOpen={isEnhancedRefreshModalOpen}
        onRequestClose={handleRequestCloseEnhancedRefreshModal}
        overlayClassName="modal--map-action-refresh__overlay"
      />

      <PurchaseFateFromGateEvent
        disableTouchEvents
        isModalOpen={isPurchaseFateModalOpen}
        onRequestClose={handleRequestClosePurchaseFateModal}
        style={{
          overlay: {
            zIndex: 20000,
          },
        }}
      />
    </ActionRefreshContext.Provider>
  );
}

MapContainer.displayName = "MapContainer";
