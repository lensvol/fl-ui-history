import { SettingsActions } from "actions/settings";
import { FetchSettingsSuccess } from "actions/settings/fetch";
import { FetchSubscriptionSuccess } from "actions/subscription";
import * as SubscriptionActionTypes from "actiontypes/subscription";
import {
  AuthMethod,
  FetchSettingsResponse,
  MessageVia,
} from "services/SettingsService";
import { IQuality } from "types/qualities";
import { MessagePreferences } from "types/settings";
import * as SettingsActionTypes from "../actiontypes/settings";

export type ISettingsState = {
  authMethods: AuthMethod[] | undefined;
  isFetching: boolean;
  isFetchingAuthMethods: boolean;
  isSaving: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isChangingVia: boolean;
  isResetting: boolean;
  isUsernameDialogOpen: boolean;
  isChangingUsername: boolean;
  isDeactivateDialogVisible: boolean;
  isEmailLinkDialogVisible: boolean;
  isUpdatingEmail: boolean;
  isEmailUpdateDialogVisible: boolean;
  isUnlinking: boolean;
  isLinkingEmail: boolean;
  isDeactivating: boolean;
  data: {
    name: string | undefined;
    emailAddress: string | undefined;
    emailAuth: boolean;
    facebookAuth: boolean;
    messageViaNetwork: MessageVia | undefined;
    qualitiesPossessedList: IQuality[];
    twitterAuth: boolean;
  };
  messagePreferences: MessagePreferences;
  subscriptions: {
    hasAndroidSubscription: boolean;
    hasAppleSubscrption: boolean;
    hasBraintreeSubscription: boolean;
  };
};

export const INITIAL_STATE: ISettingsState = {
  authMethods: undefined,
  isFetching: false,
  isFetchingAuthMethods: false,
  isSaving: false,
  isCreating: false,
  isDeleting: false,
  isChangingVia: false,
  isResetting: false,
  isUsernameDialogOpen: false,
  isChangingUsername: false,
  isDeactivateDialogVisible: false,
  isEmailLinkDialogVisible: false,
  isUpdatingEmail: false,
  isEmailUpdateDialogVisible: false,
  isUnlinking: false,
  isLinkingEmail: false,
  isDeactivating: false,
  messagePreferences: {
    messageAboutAnnouncements: false,
    messageAboutNastiness: false,
    messageAboutNiceness: false,
    messageAboutStorylets: false,
  },
  subscriptions: {
    hasAndroidSubscription: false,
    hasAppleSubscrption: false,
    hasBraintreeSubscription: false,
  },
  data: {
    emailAddress: undefined,
    emailAuth: false,
    facebookAuth: false,
    messageViaNetwork: undefined,
    name: undefined,
    qualitiesPossessedList: [],
    twitterAuth: false,
  },
};

export default function reducer(
  state: ISettingsState = INITIAL_STATE,
  action: SettingsActions | FetchSubscriptionSuccess
): ISettingsState {
  switch (action.type) {
    case SettingsActionTypes.FETCH_SETTINGS_REQUESTED:
      return { ...state, isFetching: true };

    case SettingsActionTypes.FETCH_SETTINGS_FAILURE:
      return { ...state, isFetching: false };

    // Listen for changes that get propagated via refreshing the subscription state
    case SubscriptionActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          hasBraintreeSubscription: action.payload.hasSubscription,
        },
      };

    case SettingsActionTypes.FETCH_SETTINGS_SUCCESS: {
      const {
        hasBraintreeSubscription,
        messageAboutAnnouncements,
        messageAboutNiceness,
        messageAboutNastiness,
        messageAboutStorylets,
      }: FetchSettingsResponse = (action as FetchSettingsSuccess).payload;
      return {
        ...state,
        isFetching: false,
        data: action.payload,
        messagePreferences: {
          ...state.messagePreferences,
          messageAboutAnnouncements,
          messageAboutNastiness,
          messageAboutNiceness,
          messageAboutStorylets,
        },
        subscriptions: {
          ...state.subscriptions,
          hasBraintreeSubscription,
        },
      };
    }

    case SettingsActionTypes.FETCH_AUTH_METHODS_REQUESTED:
    case SettingsActionTypes.FETCH_AUTH_METHODS_FAILURE:
      return {
        ...state,
        isFetchingAuthMethods: true,
      };

    case SettingsActionTypes.FETCH_AUTH_METHODS_SUCCESS:
      return {
        ...state,
        authMethods: action.payload,
        isFetchingAuthMethods: false,
      };

    case SettingsActionTypes.UPDATE_MESSAGE_PREFERENCES:
      return {
        ...state,
        messagePreferences: {
          ...state.messagePreferences,
          ...action.payload,
        },
      };

    case SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_REQUESTED:
      return { ...state, isSaving: true };

    case SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_FAILURE:
      return { ...state, isSaving: false };

    case SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_SUCCESS:
      return {
        ...state,
        isSaving: false,
        messagePreferences: {
          ...state.messagePreferences,
          ...action.payload,
        },
      };

    case SettingsActionTypes.REQUEST_PASSWORD_RESET_REQUESTED:
      return state;

    case SettingsActionTypes.REQUEST_PASSWORD_RESET_FAILURE:
      return {
        ...state,
      };

    case SettingsActionTypes.REQUEST_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
      };

    case SettingsActionTypes.CHANGE_USERNAME_REQUESTED:
      return { ...state, isChangingUsername: true };

    case SettingsActionTypes.CHANGE_USERNAME_FAILURE:
      return { ...state, isChangingUsername: false };

    case SettingsActionTypes.CHANGE_USERNAME_SUCCESS:
      return {
        ...state,
        isChangingUsername: false,
        data: {
          ...state.data,
          name: action.payload.username,
        },
      };

    case SettingsActionTypes.SAVE_MESSAGES_VIA_REQUESTED:
      return { ...state, isChangingVia: true };

    case SettingsActionTypes.SAVE_MESSAGES_VIA_FAILURE:
      return { ...state, isChangingVia: false };

    case SettingsActionTypes.SAVE_MESSAGES_VIA_SUCCESS:
      return { ...state, isChangingVia: false };

    case SettingsActionTypes.DEACTIVATE_ACCOUNT_REQUESTED:
      return { ...state, isDeactivating: true };

    case SettingsActionTypes.DEACTIVATE_ACCOUNT_FAILURE:
      return { ...state, isDeactivating: false };

    case SettingsActionTypes.DEACTIVATE_ACCOUNT_SUCCESS:
      return { ...state, isDeactivating: false };

    case SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_REQUESTED:
      return { ...state, isLinkingEmail: true };

    case SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_FAILURE:
      return { ...state, isLinkingEmail: false };

    case SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_SUCCESS:
      return { ...state, isLinkingEmail: false };

    case SettingsActionTypes.UPDATE_EMAIL_REQUESTED:
      return { ...state, isUpdatingEmail: true };

    case SettingsActionTypes.UPDATE_EMAIL_FAILURE:
      return { ...state, isUpdatingEmail: false };

    case SettingsActionTypes.UPDATE_EMAIL_SUCCESS:
      return {
        ...state,
        isUpdatingEmail: false,
        data: {
          ...state.data,
          emailAddress: action.payload.emailAddress,
        },
      };

    case SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_REQUESTED:
      return { ...state, isUnlinking: true };

    case SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_FAILURE:
      return { ...state, isUnlinking: false };

    case SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_SUCCESS:
      return {
        ...state,
        isUnlinking: false,
        data: {
          ...state.data,
          // Which account did we just unlink?
          twitterAuth:
            action.payload.accountType === "twitter"
              ? false
              : state.data.twitterAuth,
          facebookAuth:
            action.payload.accountType === "facebook"
              ? false
              : state.data.facebookAuth,
        },
      };

    case SettingsActionTypes.LINK_SOCIAL_ACCOUNT_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          twitterAuth:
            action.payload.accountType === "twitter"
              ? true
              : state.data.twitterAuth,
          facebookAuth:
            action.payload.accountType === "facebook"
              ? true
              : state.data.facebookAuth,
        },
      };

    case SettingsActionTypes.PASSWORD_RESET_REQUESTED:
      return { ...state, isResetting: true };

    case SettingsActionTypes.PASSWORD_RESET_FAILURE:
      return { ...state, isResetting: false };

    case SettingsActionTypes.PASSWORD_RESET_SUCCESS:
      return { ...state, isResetting: false };

    default:
      return state;
  }
}
