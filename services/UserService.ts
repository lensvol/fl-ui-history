import { AreaWithNestedJsonInfo, ISetting } from "types/map";
import { PrivilegeLevel } from "types/user";
import BaseService, { Either } from "./BaseMonadicService";

export interface ILoginCredentials {
  emailAddress: string;
  password: string;
  accessCodeName?: string;
}

export type LoginResponseUser = {
  emailAddress?: string;
  id?: number;
  name?: string;
  nex?: string;
};

export type LoginResponse = {
  accessCodeResult?: { message: string; isSuccess: boolean };
  area?: AreaWithNestedJsonInfo;
  hasCharacter: boolean;
  jwt?: string;
  message?: string;
  privilegeLevel: PrivilegeLevel;
  request?: {
    emailAddress?: string;
    password?: string;
    accessCodeName?: string;
    gender?: string;
    avatar?: string;
    userName?: string;
  };
  user?: LoginResponseUser;
};

export interface FetchUserResponse {
  area: AreaWithNestedJsonInfo;
  hasCharacter: boolean;
  jwt: string;
  privilegeLevel: PrivilegeLevel;
  setting: ISetting;
  shouldDisplayAuthNag: boolean;
  user: LoginResponseUser;
}

export interface IUserState {
  hasCharacter: boolean;
  isFetching: boolean;
  isTwitterNagScreenOpen: boolean;
  loggedIn: boolean;
  privilegeLevel: PrivilegeLevel | undefined;
  user:
    | {
        createdAt: string;
        name: string;
        id: number;
      }
    | undefined;
}

export interface IUserService {
  fetchUser: () => Promise<Either<FetchUserResponse>>;
  facebookLogin: (arg: any) => Promise<Either<LoginResponse>>;
  googleLogin: (arg: {
    accessCodeName?: string;
    token: string;
  }) => Promise<Either<LoginResponse>>;
  login: (credentials: ILoginCredentials) => Promise<Either<LoginResponse>>;
  logout: () => Promise<
    Either<{
      /* empty response expected */
    }>
  >;
}

class UserService extends BaseService implements IUserService {
  constructor() {
    super();

    this.config = {
      ...this.config,
      method: "post",
    };
  }

  login = (creds: ILoginCredentials) => {
    const config = {
      url: "/login",
      data: {
        accessCodeName: creds.accessCodeName,
        email: creds.emailAddress,
        password: creds.password,
      },
    };
    return this.doRequest<LoginResponse>(config);
  };

  fetchUser = () => {
    const config = {
      url: "login/user",
      method: "get",
    };
    return this.doRequest(config);
  };

  facebookLogin = (data: any) => {
    const config = {
      url: "/facebook/processsignedrequest",
      data,
    };
    return this.doRequest(config);
  };

  googleLogin = (token: any) => {
    const config = {
      method: "post",
      url: "/google/callback",
      data: token,
    };
    return this.doRequest<LoginResponse>(config);
  };

  logout = () => {
    const config = {
      url: "/login/logout",
    };
    return this.doRequest(config);
  };
}

export { UserService as default };
