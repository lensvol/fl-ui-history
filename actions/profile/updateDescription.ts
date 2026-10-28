import { ActionCreator } from "@reduxjs/toolkit";

import { handleVersionMismatch } from "actions/versionSync";

import {
  UPDATE_DESCRIPTION_FAILURE,
  UPDATE_DESCRIPTION_REQUESTED,
  UPDATE_DESCRIPTION_SUCCESS,
} from "actiontypes/profile";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ProfileService, {
  IProfileService,
  UpdateDescriptionResponse as BaseUpdateDescriptionResponse,
} from "services/ProfileService";

type UpdateDescriptionArg = {
  description: string;
};

type UpdateDescriptionResponse = BaseUpdateDescriptionResponse &
  UpdateDescriptionArg;

type UpdateDescriptionRequested = {
  type: typeof UPDATE_DESCRIPTION_REQUESTED;
};

type UpdateDescriptionFailure = {
  type: typeof UPDATE_DESCRIPTION_FAILURE;
};

type UpdateDescriptionSuccess = {
  type: typeof UPDATE_DESCRIPTION_SUCCESS;
  payload: UpdateDescriptionResponse;
};

export type UpdateDescriptionActions =
  | UpdateDescriptionRequested
  | UpdateDescriptionFailure
  | UpdateDescriptionSuccess;

export default updateDescription(new ProfileService());

function updateDescription(service: IProfileService) {
  return ({ description }: UpdateDescriptionArg) =>
    async (dispatch: Function) => {
      dispatch(updateDescriptionRequest());

      try {
        const response = await service.updateDescription(description);

        if (response instanceof Success) {
          dispatch(
            updateDescriptionSuccess({
              ...response.data,
              description,
            })
          );

          return {
            ...response.data,
            description,
          };
        }

        throw response;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));

          return error;
        }

        dispatch(updateDescriptionFailure());

        throw error;
      }
    };
}

const updateDescriptionRequest: ActionCreator<
  UpdateDescriptionRequested
> = () => ({
  type: UPDATE_DESCRIPTION_REQUESTED,
});

const updateDescriptionSuccess: ActionCreator<UpdateDescriptionSuccess> = (
  response: UpdateDescriptionResponse
) => ({
  type: UPDATE_DESCRIPTION_SUCCESS,
  payload: response,
});

const updateDescriptionFailure: ActionCreator<
  UpdateDescriptionFailure
> = () => ({
  type: UPDATE_DESCRIPTION_FAILURE,
});
