import BaseService from "services/BaseService";

import { IMessages } from "types/app/messages";
import { ISetting } from "types/map";
import {
  ApiAvailableStorylet,
  BeginSocialEventResponse,
  IBranch,
  IEndStorylet,
  IInStorylet,
  StoryletPhase,
} from "types/storylet";

export interface ApiInternalSocialActRequest {
  branchId: number;
  targetCharacterId: number;
  userMessage: string;
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
  actInviterQReqText: string;
  actQReqText: string;
  addedFriendId: number;
  branchId: number;
  designatedFriend?: ApiCharacterFriend;
  eligibleFriends?: ApiCharacterFriend[];
  message: string;
};

export type ApiCharacterFriend = {
  id: number;
  name: string;
  userId: number;
  userName: string;
};

export type FetchIneligibleContactsResponse = {
  ineligibleContacts: {
    correctInstance: string;
    name: string;
    qualifies: string;
    youQualify: string;
  }[];
  message: string;
};

export interface IApiStoryletResponseData {
  actions: number;
  canChangeOutfit: boolean;
  elapsed?: number;
  endStorylet?: IEndStorylet;
  hasUpdatedCharacter?: boolean;
  isSuccess: boolean;
  maxHandSize?: number;
  messages?: IMessages;
  phase: StoryletPhase;
  rename?: ApiShowRenamableQualities;
  secondChance?: ApiSecondChance;
  setting?: ISetting;
  socialAct?: ApiSocialActResponse;
  storylet?: IInStorylet;
  storylets?: ApiAvailableStorylet[];
}

export interface ApiAddContactRequest {
  branchId: number;
  username: string;
}

export interface IChooseBranchRequestData {
  branchId: number;
  secondChanceIds?: number[];
}

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
      data: {
        eventId,
      },
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
      data: {
        branchId,
      },
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
        name: data.name,
        qualityPossessedId: data.qualityPossessedId,
      },
    };

    return this.doRequest(config);
  };

  sendSocialInvite = (data: ApiInternalSocialActRequest) => {
    const config = {
      method: "post",
      url: "/storylet/sendinternalsocialact",
      data: {
        branchId: data.branchId,
        targetCharacterId: data.targetCharacterId,
        userMessage: data.userMessage,
      },
    };

    return this.doRequest<IApiStoryletResponseData>(config);
  };

  useQuality = (qualityId: number) => {
    const config = {
      method: "post",
      url: "/storylet/usequality",
      data: {
        qualityId,
      },
    };

    return this.doRequest(config);
  };
}
