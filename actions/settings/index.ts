import { ChangeUsernameActions } from "actions/settings/changeUsername";
import { DeactivateAccountActions } from "actions/settings/deactivateAccount";
import { FetchSettingsActions } from "actions/settings/fetch";
import { FetchAuthMethodsActions } from "actions/settings/fetchAuthMethods";
import { LinkEmailToAcountActions } from "actions/settings/linkEmailToAccount";
import { LinkSocialAccountActions } from "actions/settings/linkSocialAccount";
import { RequestPasswordResetActions } from "actions/settings/requestPasswordReset";
import { ResetPasswordActions } from "actions/settings/resetPassword";
import { SaveMessagePreferencesActions } from "actions/settings/saveMessagePreferences";
import { SaveMessageViaActions } from "actions/settings/saveMessageVia";
import { UnlinkSocialAccountActions } from "actions/settings/unlinkSocialAccount";
import { UpdateEmailAddressActions } from "actions/settings/updateEmailAddress";
import * as SettingsActionTypes from "actiontypes/settings";
import { MessagePreferences } from "reducers/settings";

export { default as changeUsername } from "./changeUsername";
export { default as deactivateAccount } from "./deactivateAccount";
export { default as fetch } from "./fetch";
export { default as linkEmailToAccount } from "./linkEmailToAccount";
export { default as requestPasswordReset } from "./requestPasswordReset";
export { default as resetPassword } from "./resetPassword";
export { default as saveMessagePreferences } from "./saveMessagePreferences";
export { default as saveMessageVia } from "./saveMessageVia";
export { default as unlinkSocialAccount } from "./unlinkSocialAccount";
export { default as updateEmailAddress } from "./updateEmailAddress";

export type SettingsActions =
  | ChangeUsernameActions
  | DeactivateAccountActions
  | FetchAuthMethodsActions
  | FetchSettingsActions
  | LinkEmailToAcountActions
  | LinkSocialAccountActions
  | RequestPasswordResetActions
  | ResetPasswordActions
  | SaveMessagePreferencesActions
  | SaveMessageViaActions
  | UnlinkSocialAccountActions
  | UpdateEmailAddressActions
  | UpdateMessagePreferences;

export {
  linkFacebook,
  linkSocialAccountSuccess,
  linkTwitter,
} from "./linkSocialAccount";

export const toggleNotificationDialog = () => ({
  type: SettingsActionTypes.TOGGLE_NOTIFICATION_DIALOG,
});

export type UpdateMessagePreferences = {
  type: typeof SettingsActionTypes.UPDATE_MESSAGE_PREFERENCES;
  payload: Partial<MessagePreferences>;
};

export const updateMessagePreferences = (
  messagePreferences: Partial<MessagePreferences>
) => ({
  type: SettingsActionTypes.UPDATE_MESSAGE_PREFERENCES,
  payload: messagePreferences,
});
