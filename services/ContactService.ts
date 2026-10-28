import BaseService, { Either } from "services/BaseMonadicService";

import { BaseResponse } from "types/app";

export interface IContactService {
  addContact: (userName: string) => Promise<Either<AddContactResponse>>;
  addFacebookContacts: () => Promise<Either<unknown>>;
  deleteContact: (id: number) => Promise<Either<unknown>>;
  fetch: () => Promise<Either<IContact[]>>;
}

export interface AddContactResponse {
  contact: IContact;
  message: string;
}

export interface IContact {
  id: number;
  userId: number;
  userName: string;
}

export default class ContactService
  extends BaseService
  implements IContactService
{
  /**
   * Add contact
   * @param {String} userName
   * @return Promise
   */
  addContact = (userName: string) => {
    const config = {
      method: "post",
      url: "/contact/addcontact",
      data: {
        userName,
      },
    };

    return this.doRequest<AddContactResponse>(config);
  };

  /**
   * add facebook contacts
   */
  addFacebookContacts = () => {
    const config = {
      method: "post",
      url: "/contacts/addfacebookcontacts",
    };

    return this.doRequest(config);
  };

  /**
   * delete contact
   * @param  {Object} contactId [description]
   * @return {[type]}        [description]
   */
  deleteContact = (contactId: number) => {
    const config = {
      method: "post",
      url: "/contact/deletecontact",
      data: {
        contactId,
      },
    };

    return this.doRequest<BaseResponse>(config);
  };

  /**
   * Fetch Contacts
   * @return {Promise}
   */
  fetch = () => {
    const config = {
      method: "get",
      url: "/contact",
    };

    return this.doRequest<IContact[]>(config);
  };
}
