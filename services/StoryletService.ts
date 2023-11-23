import { IMessages } from "types/app/messages";
import {
  ApiAvailableStorylet,
  IBranch,
  IEndStorylet,
  IInStorylet,
  StoryletPhase,
  BeginSocialEventResponse,
} from "types/storylet";
import BaseService from "./BaseService";

import { ISetting } from "types/map";

type ApiExternalSocialActResponse = {
  branch: IBranch;
  message: string;
};

export interface ApiInternalSocialActRequest {
  userMessage: string;
  branchId: number;
  targetCharacterId: number;
}

type ApiShowRenamableQualities = any;

export type ApiSecondChance = {
  branch: IBranch;
  currentActionsRemaining: number;
};

export type ApiSocialActResponse = {
  actMessagePreview: string;
  branch: IBranch;
  inviteeData: ApiActInviteeSelection;
  isSocialEvent: boolean;
  uniqueActPending: boolean;
  urgency: "Normal" | "Compelling";
};

export type ApiActInviteeSelection = {
  branchId: number;
  message: string;
  actQReqText: string;
  actInviterQReqText: string;
  designatedFriend?: ApiCharacterFriend;
  eligibleFriends?: ApiCharacterFriend[];
  addedFriendId: number;
};

export type ApiCharacterFriend = {
  userId: number;
  id: number;
  name: string;
  userName: string;
};

export type FetchIneligibleContactsResponse = {
  message: string;
  ineligibleContacts: {
    name: string;
    qualifies: string;
    correctInstance: string;
    youQualify: string;
  }[];
};

export interface IApiStoryletResponseData {
  actions: number;
  canChangeOutfit: boolean;
  phase: StoryletPhase;
  endStorylet?: IEndStorylet;
  externalSocialAct?: ApiExternalSocialActResponse;
  isSuccess: boolean;
  messages?: IMessages;
  rename?: ApiShowRenamableQualities;
  secondChance?: ApiSecondChance;
  socialAct?: ApiSocialActResponse;
  storylets?: ApiAvailableStorylet[];
  storylet?: IInStorylet;
  setting?: ISetting;
  hasUpdatedCharacter?: boolean;
}

export interface ApiAddContactRequest {
  username: string;
  branchId: number;
}

export interface IChooseBranchRequestData {
  branchId: number;
  secondChanceIds?: number[];
}

export type SuggestedContact = {
  userId: number;
  id: number;
  name: string;
  userName: string;
};

export interface IStoryletService {
  addNewContact: (
    contactData: ApiAddContactRequest
  ) => Promise<{ data: ApiActInviteeSelection }>;
  begin: (eventId: number) => Promise<{ data: IApiStoryletResponseData }>;
  beginSocialEvent: (
    eventId: number
  ) => Promise<{ data: BeginSocialEventResponse }>;
  chooseBranch: (
    data: IChooseBranchRequestData
  ) => Promise<{ data: IApiStoryletResponseData }>;
  fetchAvailable: () => Promise<{ data: IApiStoryletResponseData }>;
  fetchIneligibleContacts: (
    branchId: number
  ) => Promise<{ data: FetchIneligibleContactsResponse }>;
  goBack: () => Promise<{ data: IApiStoryletResponseData }>;
  renameQuality: (stuff: {
    branchId: number;
    qualityPossessedId: number;
    name: string;
  }) => Promise<{ data: IApiStoryletResponseData }>;
  sendSocialInvite: (
    invitation: ApiInternalSocialActRequest
  ) => Promise<{ data: IApiStoryletResponseData }>;
  suggestContact: (branchId: number) => Promise<{ data: SuggestedContact }>;
}

export default class StoryletService
  extends BaseService
  implements IStoryletService
{
  addNewContact = (data: ApiAddContactRequest) => {
    const config = {
      method: "post",
      url: "/storylet/addcontact",
      data: {
        branchId: data.branchId,
        username: data.username,
      },
    };
    return this.doRequest(config);
  };

  begin = (eventId: number) => {
    const config = {
      data: { eventId },
      method: "post",
      url: "/storylet/begin",
    };
    return this.doRequest<IApiStoryletResponseData>(config);
  };

  beginSocialEvent = (invitationId: number) => {
    const config = {
      method: "post",
      url: `/storylet/beginsocialevent/${invitationId}`,
    };
    return this.doRequest<BeginSocialEventResponse>(config);
  };

  chooseBranch = (data: IChooseBranchRequestData) => {
    const config = {
      method: "post",
      url: "/storylet/choosebranch",
      data: {
        branchId: data.branchId,
        secondChanceIds: data.secondChanceIds,
      },
    };
    return this.doRequest<IApiStoryletResponseData>(config);
  };

  fetchAvailable = () => {
    const config = {
      method: "post",
      url: "/storylet",
    };
    return this.doRequest<IApiStoryletResponseData>(config);
  };

  fetchIneligibleContacts = (branchId: number) => {
    const config = {
      method: "post",
      url: "/storylet/ineligiblecontacts",
      data: { branchId },
    };
    return this.doRequest<FetchIneligibleContactsResponse>(config);
  };

  goBack = () => {
    const config = {
      method: "post",
      url: "/storylet/goback",
    };
    return this.doRequest<IApiStoryletResponseData>(config);
  };

  renameQuality = (data: any) => {
    const config = {
      method: "post",
      url: "/storylet/renamequality",
      data: {
        branchId: data.branchId,
        qualityPossessedId: data.qualityPossessedId,
        name: data.name,
      },
    };
    return this.doRequest(config);
  };

  sendSocialInvite = (data: ApiInternalSocialActRequest) => {
    const config = {
      method: "post",
      url: "/storylet/sendinternalsocialact",
      data: {
        userMessage: data.userMessage,
        branchId: data.branchId,
        targetCharacterId: data.targetCharacterId,
      },
    };
    return this.doRequest<IApiStoryletResponseData>(config);
  };

  sendExternalSocialInvite = (data: any) => {
    const config = {
      method: "post",
      url: "/storylet/sendexternalsocialact",
      data,
    };
    return this.doRequest(config);
  };

  suggestContact = (branchId: number) => {
    const config = {
      method: "get",
      url: `/storylet/suggest?branchid=${branchId}`,
    };
    return this.doRequest(config);
  };

  useQuality = (qualityId: number) => {
    const config = {
      method: "post",
      url: "/storylet/usequality",
      data: { qualityId },
    };
    return this.doRequest(config);
  };
}
