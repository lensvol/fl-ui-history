import { Utm } from "utm-extractor";

import BaseService, { Either } from "services/BaseMonadicService";

export type VisitLoginResponse = {};

export interface ILoginService {
  onVisitLogin: () => Promise<Either<VisitLoginResponse>>;
}

export default class LoginService extends BaseService implements ILoginService {
  onVisitLogin = () => {
    const queryString = window.location.href;
    const utm = new Utm(queryString);
    const values = utm.get();

    const config = {
      method: "post",
      url: "/login/visit",
      data: values,
    };

    return this.doRequest<VisitLoginResponse>(config);
  };
}
