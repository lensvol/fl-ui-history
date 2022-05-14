import BaseService from './BaseService';

export interface IRegisterService {
  emailRegister: (data: any) => Promise<{ data: any }>,
  fetch: () => Promise<{ data: any }>,
}

export type FetchRegisterResponse = {
  gentlemenAvatars: string[],
  ladyAvatars: string[],
  indistinctAvatars: string[],
};

class RegisterService extends BaseService implements IRegisterService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetch = () => {
    const config = {
      url: '/register',
    };
    return this.doRequest(config);
  };

  checkAvailability = (name: string) => {
    const config = {
      url: `/register/characternameavailable?characterName=${name}`,
    };
    return this.doRequest(config);
  };


  /**
   * Register
   * @param  {Object} data
   * @return {Promise}
   */
  emailRegister = (data = {}) => {
    const config = {
      method: 'post',
      url: '/register/emailregisteruser',
      data,
    };
    return this.doRequest(config);
  };


  /**
   * Create Character
   * @param  {Object} data
   * @return {Promise}
   */
  createCharacter = (data = {}) => {
    const config = {
      method: 'post',
      url: '/register/createcharacter',
      data,
    };
    return this.doRequest(config);
  };
}

export { RegisterService as default };
