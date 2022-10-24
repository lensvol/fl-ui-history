import { handleVersionMismatch } from "actions/versionSync";
import {
  SHARE_CONTENT_COMPLETE,
  SHARE_CONTENT_FAILURE,
  SHARE_CONTENT_REQUESTED,
  SHARE_CONTENT_SUCCESS,
} from "actiontypes/profile";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ProfileService, { IProfileService } from "services/ProfileService";

export type ShareContentComplete = { type: typeof SHARE_CONTENT_COMPLETE };
export type ShareContentRequested = { type: typeof SHARE_CONTENT_REQUESTED };
export type ShareContentFailure = { type: typeof SHARE_CONTENT_FAILURE };
export type ShareContentSuccess = {
  type: typeof SHARE_CONTENT_SUCCESS;
  payload: string;
};

export type ShareContentActions =
  | ShareContentComplete
  | ShareContentRequested
  | ShareContentFailure
  | ShareContentSuccess;

export type ShareContentArgs = {
  contentClass: any;
  contentKey: any;
  image: any;
  message: any;
};

export default shareContent(new ProfileService());

export function shareContent(service: IProfileService) {
  return ({ contentClass, contentKey, image, message }: ShareContentArgs) =>
    async (dispatch: Function) => {
      dispatch(shareContentRequest());
      try {
        // const { data } = await service.share(contentClass, contentKey, image, message);
        const result = await service.share(
          contentClass,
          contentKey,
          image,
          message
        );
        if (result instanceof Success) {
          dispatch(shareContentSuccess(result.data));
        } else {
          dispatch(shareContentFailure(result.message));
        }
        return result;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
          return error;
        }
        dispatch(shareContentFailure(error));
        throw error;
      }
    };
}

const shareContentRequest: ActionCreator<ShareContentRequested> = () => ({
  type: SHARE_CONTENT_REQUESTED,
});

const shareContentSuccess: ActionCreator<ShareContentSuccess> = (data: {
  message: string;
}) => ({
  type: SHARE_CONTENT_SUCCESS,
  payload: data.message,
  shareMessageResponse: data.message,
});

const shareContentFailure: ActionCreator<ShareContentFailure> = (
  _message: any
) => ({
  type: SHARE_CONTENT_FAILURE,
});

export const shareContentComplete: ActionCreator<
  ShareContentComplete
> = () => ({
  type: SHARE_CONTENT_COMPLETE,
});
