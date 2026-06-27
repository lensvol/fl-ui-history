import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_SNIPPETS_FAILURE,
  FETCH_SNIPPETS_REQUESTED,
  FETCH_SNIPPETS_SUCCESS,
  SUPPORTING_DATA_FAILURE,
  SUPPORTING_DATA_REQUESTED,
  SUPPORTING_DATA_SUCCESS,
} from "actiontypes/infoBar";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import InfoBarService, {
  GetSupportingDataResponse,
  Snippet,
} from "services/InfoBarService";

type FetchSnippetsRequested = {
  type: typeof FETCH_SNIPPETS_REQUESTED;
};

type FetchSnippetsSuccess = {
  type: typeof FETCH_SNIPPETS_SUCCESS;
  payload: {
    snippets: Snippet[];
  };
};

type FetchSnippetsFailure = {
  type: typeof FETCH_SNIPPETS_FAILURE;
};

type FetchSnippetsAction =
  FetchSnippetsFailure | FetchSnippetsRequested | FetchSnippetsSuccess;

type GetSupportingDataRequested = {
  type: typeof SUPPORTING_DATA_REQUESTED;
};

type GetSupportingDataSuccess = {
  type: typeof SUPPORTING_DATA_SUCCESS;
  payload: GetSupportingDataResponse;
};

type GetSupportingDataFailure = {
  type: typeof SUPPORTING_DATA_FAILURE;
};

type GetSupportingDataAction =
  | GetSupportingDataFailure
  | GetSupportingDataRequested
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

const fetchSnippetsRequested: ActionCreator<FetchSnippetsRequested> = () => ({
  type: FETCH_SNIPPETS_REQUESTED,
});

const fetchSnippetsSuccess: ActionCreator<FetchSnippetsSuccess> = (
  snippets: Snippet[]
) => ({
  type: FETCH_SNIPPETS_SUCCESS,
  payload: {
    snippets,
  },
});

const fetchSnippetsFailure: ActionCreator<FetchSnippetsFailure> = (
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

const getSupportingDataSuccess: ActionCreator<GetSupportingDataSuccess> = ({
  advert,
  isSocialAvailable,
  snippets,
}: GetSupportingDataResponse) => ({
  type: SUPPORTING_DATA_SUCCESS,
  payload: {
    advert,
    isSocialAvailable,
    snippets,
  },
});

const getSupportingDataRequested: ActionCreator<
  GetSupportingDataRequested
> = () => ({
  type: SUPPORTING_DATA_REQUESTED,
});

const getSupportingDataFailure: ActionCreator<
  GetSupportingDataFailure
> = () => ({
  type: SUPPORTING_DATA_FAILURE,
});
