import BaseService, { Either } from "services/BaseMonadicService";

import { IMessages } from "types/app/messages";
import { FetchMessageType } from "types/messages";

export type Message = {
  ago: string;
  date: string;
  description: string;
  image: string;
  relatedId: number;
  title: string;
  type: string;
};

type BaseInvitationResponse = {
  actions: number;
  content: Message;
  elapsed?: number;
  messages: IMessages;
};

export type AcceptInvitationResponse = BaseInvitationResponse;

type CancelInvitationResponse = BaseInvitationResponse;

type DeleteMessageResponse = {};

type EmailMessageResponse = {};

export type FetchAllMessagesResponse = {
  feedMessages: Message[];
  interactions: Message[];
};

type FetchMessagesResponse = Message[];

type RejectInvitationResponse = BaseInvitationResponse;

export interface IMessagesService {
  acceptInvitation: (
    invitationId: number
  ) => Promise<Either<AcceptInvitationResponse>>;
  cancelInvitation: (
    invitationId: number
  ) => Promise<Either<CancelInvitationResponse>>;
  deleteMessage: (messageId: number) => Promise<Either<DeleteMessageResponse>>;
  emailMessage: (messageId: number) => Promise<Either<EmailMessageResponse>>;
  fetch: (what: FetchMessageType) => Promise<Either<FetchMessagesResponse>>;
  fetchAll: () => Promise<Either<FetchAllMessagesResponse>>;
  rejectInvitation: (
    invitationId: number
  ) => Promise<Either<RejectInvitationResponse>>;
}

export default class MessagesService
  extends BaseService
  implements IMessagesService
{
  acceptInvitation = (invitationId: number) => {
    const config = {
      method: "post",
      url: `/messages/acceptinvitation/${invitationId}`,
    };

    return this.doRequest<AcceptInvitationResponse>(config);
  };

  /**
   * Cancel Invitation
   * @param  {Number} invitationId
   * @return {Promise}
   */
  cancelInvitation = (invitationId: number) => {
    const config = {
      method: "post",
      url: `/messages/cancelinvitation/${invitationId}`,
    };

    return this.doRequest<RejectInvitationResponse>(config);
  };

  deleteMessage = (messageId: number) => {
    const config = {
      url: `/messages/deletemessage/${messageId}`,
      method: "post",
    };

    return this.doRequest<DeleteMessageResponse>(config);
  };

  emailMessage = (messageId: number) => {
    const config = {
      url: `/messages/emailmessage/${messageId}`,
      method: "post",
    };

    return this.doRequest<EmailMessageResponse>(config);
  };

  fetch = (what: FetchMessageType) => {
    const config = {
      method: "get",
      url: `/messages/${what}`,
    };

    return this.doRequest<FetchMessagesResponse>(config);
  };

  fetchAll = () => {
    const config = {
      method: "get",
      url: "/messages",
    };

    return this.doRequest<FetchAllMessagesResponse>(config);
  };

  /**
   * Reject Request
   * @param  {Number} invitationId
   * @return {Promise}
   */
  rejectInvitation = (invitationId: number) => {
    const config = {
      method: "post",
      url: `/messages/rejectinvitation/${invitationId}`,
    };
    return this.doRequest<RejectInvitationResponse>(config);
  };
}
