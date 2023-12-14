import BaseService from "./BaseService";

export type FetchAccessCodeResponse = {
  completedMessage: string;
  image: string;
  initialMessage: string;
  name: string;
};

export default class AccessCodeService extends BaseService {
  fetchAccessCode = (accessCodeName: string) => {
    const config = {
      url: `/accesscode/${accessCodeName}`,
      method: "post",
    };
    return this.doRequest(config);
  };

  processAccessCode = (accessCodeName: string) => {
    const config = {
      data: { accessCodeName },
      url: "/accesscode/processaccesscode",
      method: "post",
    };
    return this.doRequest(config);
  };
}
