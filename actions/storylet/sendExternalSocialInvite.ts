import {
  sendSocialInviteFailure,
  sendSocialInviteRequested,
  sendSocialInviteSuccess,
} from "actions/storylet/sendSocialinvite";
import { handleVersionMismatch } from "actions/versionSync";
import { VersionMismatch } from "services/BaseService";
import StoryletService from "services/StoryletService";

const storyletService = new StoryletService();

/** ----------------------------------------------------------------------------
 * SEND SOCIAL INVITATION
 -----------------------------------------------------------------------------*/
export const sendExternalSocialInvite = (data: any) => (dispatch: Function) => {
  dispatch(sendSocialInviteRequested());
  storyletService
    .sendExternalSocialInvite(data)
    .then((response) => {
      dispatch(sendSocialInviteSuccess(response.data));
    })
    .catch((error) => {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(sendSocialInviteFailure(error));
    });
};

export default sendExternalSocialInvite;
