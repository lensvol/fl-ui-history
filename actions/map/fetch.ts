import { IBootstrapOptions } from "actions/app/bootstrap";
import {
  FETCH_MAP_FAILURE,
  FETCH_MAP_REQUESTED,
  FETCH_MAP_SUCCESS,
} from "actiontypes/map";
import * as MapActionTypes from "actiontypes/map";
import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MapService, {
  IFetchMapResponse,
  IMapService,
} from "services/MapService";
import { isDrawable, isLodgings } from "features/mapping";
import * as SpriteCaches from "components/Map/ReactLeafletPixiOverlay/sprite-caches";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import loadAndDrawMapSprites from "features/mapping/loadAndDrawMapSprites";
import isWebGLSupported from "features/startup/isWebGLSupported";
import { IAppState } from "types/app";
import { IArea, IMappableSetting, IStateAwareArea } from "types/map";
import { ThunkDispatch } from "redux-thunk";

export type FetchMapFailure = {
  type: typeof FETCH_MAP_FAILURE;
  status?: number | undefined;
};

export type FetchMapRequested = {
  type: typeof FETCH_MAP_REQUESTED;
};

export type FetchMapSuccess = {
  type: typeof FETCH_MAP_SUCCESS;
  payload: IFetchMapResponse;
};

export type FetchMapAction =
  | FetchMapRequested
  | FetchMapSuccess
  | FetchMapFailure;

const fetchMapRequested: ActionCreator<FetchMapRequested> = () => ({
  type: MapActionTypes.FETCH_MAP_REQUESTED,
});

const fetchMapSuccess: ActionCreator<FetchMapSuccess> = (
  data: IFetchMapResponse
) => ({
  type: FETCH_MAP_SUCCESS,
  payload: data,
});

const fetchMapFailure: ActionCreator<FetchMapFailure> = (error: any) => ({
  type: MapActionTypes.FETCH_MAP_FAILURE,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * FETCH MAP
 -----------------------------------------------------------------------------*/

export default fetch(new MapService());

export function fetch(service: IMapService) {
  return (options?: IBootstrapOptions) =>
    async (
      dispatch: ThunkDispatch<any, any, any>,
      getState: () => IAppState
    ) => {
      dispatch(fetchMapRequested());

      try {
        const result: Either<IFetchMapResponse> = await service.fetch();

        if (!(result instanceof Success)) {
          dispatch(fetchMapFailure(result.message));
          return result;
        }

        // Not sure why this isn't narrowing properly; worth investigating. For now,
        // we know that this will be a Success<IFetchMapResponse>
        const { data } = result as Success<IFetchMapResponse>;

        // If we have map data, load sprites
        if (data.areas) {
          dispatch(fetchMapSuccess(data));

          const {
            map: { fallbackMapPreferred },
          } = getState();

          if (fallbackMapPreferred || !isWebGLSupported()) {
            console.info("Fallback map preferred; not loading map sprites"); // eslint-disable-line no-console
          } else {
            const { fetchSpritesNow } = options ?? {};
            const { setting } = getState().map;

            // We have the Setting, but it may not be mappable; check whether
            // it has a mapRootArea property

            if ((fetchSpritesNow ?? true) && setting?.mapRootArea?.areaKey) {
              // This should be OK, because it won't run twice
              await loadAndDrawMapSprites(
                data.areas.filter(
                  (area: IArea) => isDrawable(area) && !isLodgings(area)
                ),
                setting as IMappableSetting,
                options?.onSpriteLoadProgress
              );
              // Create state-aware areas, then update their sprites
              const stateAwareAreas: IStateAwareArea[] = data.areas.map(
                (area: IArea) =>
                  asStateAwareArea(
                    area,
                    data.areas,
                    setting as IMappableSetting,
                    data.currentArea
                  )
              );
              await Promise.all(
                stateAwareAreas.map(SpriteCaches.updateSpriteForArea)
              );
            }
          }
        }

        return data;
      } catch (err) {
        if (err instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(err));
          return err;
        }
        console.error(err);
        dispatch(fetchMapFailure(err));
        throw err;
      }
    };
}
