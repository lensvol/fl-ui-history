import { IMessages } from "types/app/messages";
import BaseService, { Either } from "./BaseMonadicService";

export type Message = {
  type: string;
  image: string;
  relatedId: number;
  title: string;
  description: string;
  date: string;
  ago: string;
};

type BaseInvitationResponse = {
  actions: number;
  messages: IMessages;
  content: Message;
};

export type AcceptInvitationResponse = BaseInvitationResponse;
export type CancelInvitationResponse = BaseInvitationResponse;
export type DeleteMessageResponse = {};
export type EmailMessageResponse = {};
export type FetchAllMessagesResponse = {
  feedMessages: Message[];
  interactions: Message[];
};
export type FetchMessagesResponse = Message[];
export type RejectInvitationResponse = BaseInvitationResponse;

export interface IMessagesService {
  acceptInvitation: (
    invitationId: number
  ) => Promise<Either<AcceptInvitationResponse>>;
  cancelInvitation: (
    invitationId: number
  ) => Promise<Either<CancelInvitationResponse>>;
  deleteMessage: (messageId: number) => Promise<Either<DeleteMessageResponse>>;
  emailMessage: (messageId: number) => Promise<Either<EmailMessageResponse>>;
  fetch: (
    what: "feed" | "interactions"
  ) => Promise<Either<FetchMessagesResponse>>;
  fetchAll: () => Promise<Either<FetchAllMessagesResponse>>;
  rejectInvitation: (
    invitationId: number
  ) => Promise<Either<RejectInvitationResponse>>;
}

class MessagesService extends BaseService implements IMessagesService {
  acceptInvitation = (invitationId: number) => {
    const config = {
      method: "post",
      url: `/messages/acceptinvitation/${invitationId}`,
    };
    return this.doRequest<AcceptInvitationResponse>(config);
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

  fetchAll = () => {
    return this.doRequest<FetchAllMessagesResponse>({ url: "/messages" });
  };

  fetch = (what: "feed" | "interactions") => {
    // const config = { url: '/messages' };
    const config = { url: ["/messages", what].join("/") };
    return this.doRequest<FetchMessagesResponse>(config);
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
}

export { MessagesService as default };
