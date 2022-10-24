import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_SNIPPETS_FAILURE,
  FETCH_SNIPPETS_REQUESTED,
  FETCH_SNIPPETS_SUCCESS,
  SUPPORTING_DATA_FAILURE,
  SUPPORTING_DATA_REQUESTED,
  SUPPORTING_DATA_SUCCESS,
} from "actiontypes/infoBar";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import InfoBarService, {
  GetSupportingDataResponse,
  Snippet,
} from "services/InfoBarService";

export type FetchSnippetsRequested = { type: typeof FETCH_SNIPPETS_REQUESTED };
export type FetchSnippetsSuccess = {
  type: typeof FETCH_SNIPPETS_SUCCESS;
  payload: { snippets: Snippet[] };
};
export type FetchSnippetsFailure = { type: typeof FETCH_SNIPPETS_FAILURE };

export type FetchSnippetsAction =
  | FetchSnippetsFailure
  | FetchSnippetsRequested
  | FetchSnippetsSuccess;

export type GetSupportingDataRequested = {
  type: typeof SUPPORTING_DATA_REQUESTED;
};
export type GetSupportingDataSuccess = {
  type: typeof SUPPORTING_DATA_SUCCESS;
  payload: GetSupportingDataResponse;
};
export type GetSupportingDataFailure = { type: typeof SUPPORTING_DATA_FAILURE };

export type GetSupportingDataAction =
  | GetSupportingDataRequested
  | GetSupportingDataFailure
  | GetSupportingDataSuccess;

export type InfoBarActions = FetchSnippetsAction | GetSupportingDataAction;

const service = new InfoBarService();

export const fetchSnippets = () => async (dispatch: Function) => {
  dispatch(fetchSnippetsRequested());

  try {
    const result = await service.fetchSnippets();
    if (result instanceof Success) {
      const { data } = result;
      dispatch(fetchSnippetsSuccess(data));
    }
    return result;
  } catch (error) {
    if (error instanceof VersionMismatch) {
      dispatch(handleVersionMismatch(error));
      return error;
    }
    dispatch(fetchSnippetsFailure(error));
    throw error;
  }
};

export const fetchSnippetsRequested: ActionCreator<
  FetchSnippetsRequested
> = () => ({
  type: FETCH_SNIPPETS_REQUESTED,
});

export const fetchSnippetsSuccess: ActionCreator<FetchSnippetsSuccess> = (
  snippets: Snippet[]
) => ({
  type: FETCH_SNIPPETS_SUCCESS,
  payload: { snippets },
});

export const fetchSnippetsFailure: ActionCreator<FetchSnippetsFailure> = (
  error?: any
) => ({
  type: FETCH_SNIPPETS_FAILURE,
  status: error?.response?.status,
});

export const getSupportingData = () => async (dispatch: Function) => {
  dispatch(getSupportingDataRequested());

  try {
    const result = await service.getSupportingData();
    if (result instanceof Success) {
      dispatch(getSupportingDataSuccess(result.data));
    }
    return result;
  } catch (error) {
    if (error instanceof VersionMismatch) {
      dispatch(handleVersionMismatch(error));
      return error;
    }
    dispatch(getSupportingDataFailure());
    throw error;
  }
};

export const getSupportingDataSuccess: ActionCreator<
  GetSupportingDataSuccess
> = ({ advert, snippets }: GetSupportingDataResponse) => ({
  type: SUPPORTING_DATA_SUCCESS,
  payload: { advert, snippets },
});

export const getSupportingDataRequested: ActionCreator<
  GetSupportingDataRequested
> = () => ({
  type: SUPPORTING_DATA_REQUESTED,
});

export const getSupportingDataFailure: ActionCreator<
  GetSupportingDataFailure
> = () => ({
  type: SUPPORTING_DATA_FAILURE,
});
