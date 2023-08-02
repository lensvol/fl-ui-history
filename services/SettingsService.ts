/* eslint-disable camelcase */
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { IQuality } from "types/qualities";
import { MessagePreferences } from "types/settings";
import BaseService, { Either } from "./BaseMonadicService";

export type MessageVia =
  | "None"
  | "Twitter"
  | "Facebook"
  | "Email"
  | "Google"
  | "All";

export type AuthMethod = {
  type: MessageVia;
  displayName?: string;
  profileUrl?: string;
  email?: string;
};

export type FetchAuthMethodsResponse = {
  authMethods: AuthMethod[];
};

export type FetchTimeTheHealerResponse = null | {
  name: string;
  dateTimeToExecute: string;
  isSuccess: boolean;
};

export interface ISettingsService {
  fetch: () => Promise<Either<FetchSettingsResponse>>;
  fetchAuthMethods: () => Promise<Either<FetchAuthMethodsResponse>>;
  fetchTimeTheHealer: () => Promise<Either<FetchTimeTheHealerResponse>>;
  saveMessagePreferences: (
    req: MessagePreferences
  ) => Promise<Either<SaveMessagePreferencesResponse>>;
  requestPasswordReset: (
    emailAddress: string
  ) => Promise<Either<RequestPasswordResetResponse>>;
  resetPassword: (
    req: ResetPasswordRequest
  ) => Promise<Either<ResetPasswordResponse>>;
  changeUsername: (username: string) => Promise<Either<ChangeUsernameResponse>>;
  messagesVia: (type: MessageVia) => Promise<Either<MessagesViaResponse>>;
  deactivateAccount: () => Promise<Either<DeactivateAccountResponse>>;
  linkEmailToAccount: (
    req: LinkEmailRequest
  ) => Promise<Either<LinkEmailResponse>>;
  updateEmailAddress: (
    emailAddress: string
  ) => Promise<Either<UpdateEmailResponse>>;
  unlinkTwitter: () => Promise<Either<UnlinkTwitterResponse>>;
  unlinkFacebook: () => Promise<Either<UnlinkFacebookResponse>>;
  unlinkGoogle: () => Promise<Either<UnlinkGoogleResponse>>;
  linkFacebook: (
    payload: FacebookPayload
  ) => Promise<Either<LinkFacebookResponse>>;
  linkGoogle: (req: LinkGoogleRequest) => Promise<Either<LinkGoogleResponse>>;
}

export type ChangeUsernameResponse = { message: string };

export type DeactivateAccountResponse = { message: string };

export type FacebookPayload = ReactFacebookLoginInfo & {
  expiresIn?: number;
  signedRequest?: string;
  accessCodeName?: string;
};

export type FetchSettingsResponse = {
  qualitiesPossessedList: IQuality[];
  twitterAuth: boolean;
  facebookAuth: boolean;
  googleAuth: boolean;
  emailAuth: boolean;
  hasBraintreeSubscription: boolean;
  storyEventMessage: boolean;
  messageAboutAnnouncements: boolean;
  messageAboutNiceness: boolean;
  messageAboutStorylets: boolean;
  messageViaNetwork: MessageVia;
  charactersInWorlds: string[];
  name: string;
  emailAddress: string;
  nex: number;
  id: number;
};

export type LinkEmailRequest = {
  emailAddress: string;
  password: string;
};

export type LinkEmailResponse = {
  message: string;
};

export type LinkFacebookResponse = { message: string };

export type LinkGoogleRequest = { token: string };

export type LinkGoogleResponse = {
  /* empty response on success */
};

export type MessagesViaResponse = {
  message: string;
};

export type RequestPasswordResetRequest = {
  emailAddress: string;
};

export type RequestPasswordResetResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  password: string;
  token: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type SaveMessagePreferencesResponse = {
  settings: {
    messageAboutNiceness: boolean;
    messageAboutNastiness: boolean;
    messageAboutAnnouncements: boolean;
    messageAboutStorylets: boolean;
  };
  message: string;
};

export type UnlinkFacebookResponse = {
  message: string;
};

export type UnlinkGoogleResponse = {
  // empty response on success
};

export type UnlinkTwitterResponse = {
  message: string;
};

export type UpdateEmailRequest = {
  emailAddress: string;
};

export type UpdateEmailResponse = {
  message: string;
};

export default class SettingsService
  extends BaseService
  implements ISettingsService
{
  fetch = () => {
    const config = {
      url: "/settings",
    };
    return this.doRequest<FetchSettingsResponse>(config);
  };

  fetchAuthMethods = () => {
    const config = {
      url: "/settings/authmethods",
    };
    return this.doRequest<FetchAuthMethodsResponse>(config);
  };

  fetchTimeTheHealer = () => {
    const config = {
      url: "/settings/timethehealer",
    };
    return this.doRequest<FetchTimeTheHealerResponse>(config);
  };

  saveMessagePreferences = (messagePreferences: MessagePreferences) => {
    const config = {
      method: "post",
      url: "/settings/messagesettings",
      data: messagePreferences,
    };
    return this.doRequest<SaveMessagePreferencesResponse>(config);
  };

  requestPasswordReset = (emailAddress: string) => {
    const data: RequestPasswordResetRequest = { emailAddress };
    const config = {
      data,
      method: "post",
      url: "/settings/requestpasswordreset",
    };
    return this.doRequest<RequestPasswordResetResponse>(config);
  };

  resetPassword = (data: ResetPasswordRequest) => {
    const config = {
      data,
      method: "post",
      url: "settings/resetpassword",
    };
    return this.doRequest<ResetPasswordResponse>(config);
  };

  changeUsername = (username: string) => {
    const config = {
      data: username,
      method: "post",
      url: `/settings/username`,
    };
    return this.doRequest<ChangeUsernameResponse>(config);
  };

  messagesVia = (type: MessageVia) => {
    const config = {
      method: "post",
      url: `/settings/messagevia/${type}`,
    };
    return this.doRequest<MessagesViaResponse>(config);
  };

  deactivateAccount = () => {
    const config = {
      method: "post",
      url: "/settings/deactivate",
    };
    return this.doRequest<DeactivateAccountResponse>(config);
  };

  linkEmailToAccount = (data: LinkEmailRequest) => {
    const config = {
      method: "post",
      url: "/settings/linkemail",
      data,
    };
    return this.doRequest<LinkEmailResponse>(config);
  };

  updateEmailAddress = (emailAddress: string) => {
    const data: UpdateEmailRequest = { emailAddress };
    const config = {
      data,
      method: "post",
      url: "/settings/updateemail",
    };
    return this.doRequest<UpdateEmailResponse>(config);
  };

  unlinkTwitter = () => {
    const config = {
      method: "post",
      url: "/settings/unlinktwitter",
    };
    return this.doRequest<UnlinkTwitterResponse>(config);
  };

  unlinkFacebook = () => {
    const config = {
      method: "post",
      url: "/settings/unlinkfacebook",
    };
    return this.doRequest<UnlinkFacebookResponse>(config);
  };

  unlinkGoogle = () => {
    const config = {
      method: "post",
      url: "/settings/unlinkgoogle",
    };
    return this.doRequest<UnlinkGoogleResponse>(config);
  };

  linkFacebook = (data: FacebookPayload) => {
    const config = {
      data,
      url: "/facebook/link",
      method: "post",
    };
    return this.doRequest(config);
  };

  linkGoogle = (data: LinkGoogleRequest) => {
    const config = {
      data,
      url: "/google/link",
      method: "post",
    };
    return this.doRequest<LinkGoogleResponse>(config);
  };
}
