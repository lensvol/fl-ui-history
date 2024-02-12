import BaseService from "./BaseService";

export interface IRegisterService {
  emailRegister: (data: any) => Promise<{ data: any }>;
  fetch: () => Promise<{ data: any }>;
  confirmEmail: (token: string) => Promise<{
    data: any;
  }>;
}

export type FetchRegisterResponse = {
  gentlemenAvatars: string[];
  ladyAvatars: string[];
  indistinctAvatars: string[];
};

class RegisterService extends BaseService implements IRegisterService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetch = () => {
    const config = {
      method: "get",
      url: "/register",
    };
    return this.doRequest(config);
  };

  checkAvailability = (name: string) => {
    const config = {
      data: name,
      method: "post",
      url: "/register/characternameavailable",
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
      method: "post",
      url: "/register/emailregisteruser",
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
      method: "post",
      url: "/register/createcharacter",
      data,
    };
    return this.doRequest(config);
  };

  confirmEmail = (token: string) => {
    const config = {
      method: "post",
      url: "/register/confirmemail",
      data: token,
    };

    return this.doRequest(config);
  };
}

export { RegisterService as default };
