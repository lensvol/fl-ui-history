/* eslint-disable camelcase */
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { IQuality } from "types/qualities";
import { MessagePreferences } from "types/settings";
import BaseService, { Either } from "./BaseMonadicService";
import { PremiumSubscriptionType } from "types/subscription";

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
  requestVerifyEmail: () => Promise<Either<VerifyEmailResponse>>;
  unsubscribe: (
    request: UnsubscribeRequest
  ) => Promise<Either<UnsubscribeResponse>>;
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
  remainingActionRefreshes?: number;
  remainingStoryUnlocks?: number;
  subscriptionType?: PremiumSubscriptionType;
  messageAboutAnnouncements: boolean;
  messageAboutNiceness: boolean;
  messageAboutStorylets: boolean;
  messageViaNetwork: MessageVia;
  charactersInWorlds: string[];
  name: string;
  emailAddress: string;
  nex: number;
  id: number;
  emailVerified: boolean;
  socialActsAvailable: boolean;
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

export type VerifyEmailResponse = {
  message: string;
};

export type UnsubscribeRequest = {
  userId: string;
  purpose?: string;
  token: string;
};

export type UnsubscribeResponse = {
  success: boolean;
  message: string;
};

export default class SettingsService
  extends BaseService
  implements ISettingsService
{
  fetch = () => {
    const config = {
      method: "get",
      url: "/settings",
    };
    return this.doRequest<FetchSettingsResponse>(config);
  };

  fetchAuthMethods = () => {
    const config = {
      method: "get",
      url: "/settings/authmethods",
    };
    return this.doRequest<FetchAuthMethodsResponse>(config);
  };

  fetchTimeTheHealer = () => {
    const config = {
      method: "get",
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
      url: "/settings/resetpassword",
    };
    return this.doRequest<ResetPasswordResponse>(config);
  };

  changeUsername = (username: string) => {
    const config = {
      data: username,
      method: "post",
      url: "/settings/username",
      headers: {
        "Content-Type": "text/plain",
      },
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
      url: "/twitter/unlink",
    };
    return this.doRequest<UnlinkTwitterResponse>(config);
  };

  unlinkFacebook = () => {
    const config = {
      method: "post",
      url: "/facebook/unlink",
    };
    return this.doRequest<UnlinkFacebookResponse>(config);
  };

  unlinkGoogle = () => {
    const config = {
      method: "post",
      url: "/google/unlink",
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

  requestVerifyEmail = () => {
    const config = {
      method: "get",
      url: "/settings/requestverifyemail",
    };

    return this.doRequest<VerifyEmailResponse>(config);
  };

  unsubscribe = (request: UnsubscribeRequest) => {
    const config = {
      method: "post",
      url: "/settings/unsubscribe",
      data: {
        ...request,
        worldId: 1,
      },
    };

    return this.doRequest<UnsubscribeResponse>(config);
  };
}
