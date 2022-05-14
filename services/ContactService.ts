import { BaseResponse } from 'types/app';
import { IContact, IContactService } from 'types/contacts';
import BaseService from './BaseService';

class ContactService extends BaseService implements IContactService {
  /**
   * Fetch Contacts
   * @return {Promise}
   */
  fetch = () => {
    const config = {
      url: '/contact',
    };
    return this.doRequest<IContact[]>(config);
  };

  /**
   * Add contact
   * @param {String} userName
   * @return Promise
   */
  addContact = (userName: string) => {
    const config = {
      url: '/contact/addcontact',
      method: 'post',
      data: { userName },
    };
    return this.doRequest<BaseResponse & {contact: IContact }>(config);
  };


  /**
   * delete contact
   * @param  {Object} contactId [description]
   * @return {[type]}        [description]
   */
  deleteContact = (contactId: number) => {
    const config = {
      method: 'post',
      url: '/contact/deletecontact',
      data: { contactId },
    };
    return this.doRequest<BaseResponse>(config);
  };


  /**
   * add facebook contacts
   */
  addFacebookContacts = () => {
    const config = {
      method: 'post',
      url: '/contacts/addfacebookcontacts',
    };
    return this.doRequest(config);
  };


  /**
   * Add twitter contacts
   */
  addTwitterContacts = () => {
    const config = {
      method: 'post',
      url: '/contacts/addtwittercontacts',
    };
    return this.doRequest(config);
  };
}

export default ContactService;
