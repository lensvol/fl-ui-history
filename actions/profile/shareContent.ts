import { ActionCreator } from "@reduxjs/toolkit";

import { handleVersionMismatch } from "actions/versionSync";

import {
  SHARE_CONTENT_FAILURE,
  SHARE_CONTENT_REQUESTED,
  SHARE_CONTENT_SUCCESS,
} from "actiontypes/profile";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ProfileService, {
  IProfileService,
  ShareContentRequest,
  ShareResponse,
} from "services/ProfileService";

type ShareContentRequested = {
  type: typeof SHARE_CONTENT_REQUESTED;
};

type ShareContentFailure = {
  type: typeof SHARE_CONTENT_FAILURE;
};

type ShareContentSuccess = {
  type: typeof SHARE_CONTENT_SUCCESS;
  payload: ShareResponse;
};

export type ShareContentActions =
  ShareContentRequested | ShareContentFailure | ShareContentSuccess;

export default shareContent(new ProfileService());

function shareContent(service: IProfileService) {
  return (request: ShareContentRequest) => async (dispatch: Function) => {
    dispatch(shareContentRequest());

    try {
      const response = await service.share(request);

      if (response instanceof Success) {
        dispatch(shareContentSuccess(response.data));

        return response.data;
      }

      throw response;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(shareContentFailure());

      throw error;
    }
  };
}

const shareContentRequest: ActionCreator<ShareContentRequested> = () => ({
  type: SHARE_CONTENT_REQUESTED,
});

const shareContentSuccess: ActionCreator<ShareContentSuccess> = (
  response: ShareResponse
) => ({
  type: SHARE_CONTENT_SUCCESS,
  payload: response,
});

const shareContentFailure: ActionCreator<ShareContentFailure> = () => ({
  type: SHARE_CONTENT_FAILURE,
});
