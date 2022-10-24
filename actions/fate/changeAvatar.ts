import { ActionCreator } from "redux";
import { handleVersionMismatch } from "actions/versionSync";
import * as FateActionTypes from "actiontypes/fate";
import { ThunkDispatch } from "redux-thunk";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import FateService, {
  ChangeAvatarResponse,
  IFateService,
} from "services/FateService";

export type ChangeAvatarRequested = {
  type: typeof FateActionTypes.CHANGE_AVATAR_REQUESTED;
};
export type ChangeAvatarSuccess = {
  type: typeof FateActionTypes.CHANGE_AVATAR_SUCCESS;
  payload: ChangeAvatarResponse;
};

export type ChangeAvatarActions = ChangeAvatarRequested | ChangeAvatarSuccess;

export const changeAvatarRequested: ActionCreator<
  ChangeAvatarRequested
> = () => ({
  type: FateActionTypes.CHANGE_AVATAR_REQUESTED,
  isFetching: true,
});

export const changeAvatarSuccess: ActionCreator<ChangeAvatarSuccess> = (
  data: ChangeAvatarResponse
) => ({
  type: FateActionTypes.CHANGE_AVATAR_SUCCESS,
  isFetching: false,
  payload: data,
});

export function changeAvatar(service: IFateService) {
  return (avatarName: string) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      dispatch(changeAvatarRequested());

      try {
        const result = await service.changeAvatar(avatarName);
        if (result instanceof Success) {
          dispatch(changeAvatarSuccess(result.data));
        }
        return result;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
          return error;
        }
        throw error;
      }
    };
}

export default changeAvatar(new FateService());
