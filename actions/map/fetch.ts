import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import { IBootstrapOptions } from "actions/app/bootstrap";
import setFallbackMapPreferred from "actions/map/setFallbackMapPreferred";
import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_MAP_FAILURE,
  FETCH_MAP_REQUESTED,
  FETCH_MAP_SUCCESS,
} from "actiontypes/map";

import { updateSpriteForArea } from "components/Map/ReactLeafletPixiOverlay/sprite-caches";

import { isDrawable, isLodgings } from "features/mapping";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import loadAndDrawMapSprites from "features/mapping/loadAndDrawMapSprites";
import isWebGLSupported from "features/startup/isWebGLSupported";

import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MapService, {
  IFetchMapResponse,
  IMapService,
} from "services/MapService";

import { IAppState } from "types/app";
import { IArea, IMappableSetting, IStateAwareArea } from "types/map";

type FetchMapFailure = {
  type: typeof FETCH_MAP_FAILURE;
  status?: number | undefined;
};

type FetchMapRequested = {
  type: typeof FETCH_MAP_REQUESTED;
};

export type FetchMapSuccess = {
  type: typeof FETCH_MAP_SUCCESS;
  payload: IFetchMapResponse;
};

export type FetchMapAction =
  FetchMapRequested | FetchMapSuccess | FetchMapFailure;

const fetchMapRequested: ActionCreator<FetchMapRequested> = () => ({
  type: FETCH_MAP_REQUESTED,
});

const fetchMapSuccess: ActionCreator<FetchMapSuccess> = (
  data: IFetchMapResponse
) => ({
  type: FETCH_MAP_SUCCESS,
  payload: data,
});

const fetchMapFailure: ActionCreator<FetchMapFailure> = (error: any) => ({
  type: FETCH_MAP_FAILURE,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * FETCH MAP
 -----------------------------------------------------------------------------*/

export default fetchMap(new MapService());

function fetchMap(service: IMapService) {
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

        // Not sure why this isn't narrowing properly; worth investigating.
        // For now, we know that this will be a Success<IFetchMapResponse>
        const { data } = result as Success<IFetchMapResponse>;

        // If we have map data, load sprites
        if (data.areas) {
          dispatch(fetchMapSuccess(data));

          const { map } = getState();
          const { fallbackMapPreferred } = map;

          if (fallbackMapPreferred) {
            console.info("Fallback map preferred; not loading map sprites"); // eslint-disable-line no-console
          } else if (!isWebGLSupported()) {
            console.info("Fallback map required; not loading map sprites"); // eslint-disable-line no-console

            dispatch(setFallbackMapPreferred(true)); // update setting without changing preference
          } else {
            const { fetchSpritesNow } = options ?? {};
            const { setting } = map;

            // We have the Setting, but it may not be mappable;
            // check whether it has a mapRootArea property
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

              await Promise.all(stateAwareAreas.map(updateSpriteForArea));
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
