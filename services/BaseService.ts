import axios, { AxiosInstance } from "axios";
import semver from "semver";

import Config from "configuration";

import { getTokenAndStorage } from "features/startup";

export class InMaintenance extends Error {}

export class VersionMismatch extends Error {
  latestVersion: number;

  constructor(latestVersion: number) {
    super("Version mismatch");
    this.latestVersion = latestVersion;
  }
}

export default class BaseService {
  axiosInstance: AxiosInstance;
  config: any;

  /**
   * Constructor
   * @return {undefined}
   */
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Config.apiUrl,
    });

    this.config = {
      method: "get",
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, *.*",
        "Content-Type": "application/json",
      },
    };
  }

  /**
   * Do Request
   * @return {Promise}
   */
  doRequest = async <T = any>(config: any) => {
    // Override base config data with what we were passed in
    const configData: any = {
      ...this.config,
      ...config,
    };

    // Look for a JWT
    const { token = "" } = getTokenAndStorage(window);
    // If we have a token, then insert it into the request header
    if (token.length) {
      configData.headers = {
        ...(this.config.headers ?? {}),
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
        // Only send major.minor.patch
        "X-Current-Version":
          semver.coerce(Config.version)?.version ?? undefined,
      };
    }

    try {
      // Make the API call
      const response = await this.axiosInstance.request(configData);

      // Check the latest client version available
      const latestVersion =
        response.headers["x-latest-available-client-version"];

      // We're only interested in major.minor.patch versions here; if those match,
      // we're happy (this is not intended to check compatibility between dev branches
      // and the API)
      const coercedLatestVersion = semver.coerce(latestVersion)?.version;
      const coercedCurrentVersion = semver.coerce(Config.version)?.version;

      // It's OK for the client to be a version ahead of the server
      if (
        coercedCurrentVersion &&
        coercedLatestVersion &&
        !semver.gte(coercedCurrentVersion, coercedLatestVersion)
      ) {
        // noinspection ExceptionCaughtLocallyJS
        throw new VersionMismatch(latestVersion);
      }

      // Have we got response data?
      const { data } = response;
      // If no response data, then this is an error
      if (!data) {
        return Promise.reject(response);
      }
      // Look for a JWT in the response
      const { jwt } = data;
      // If there's a JWT ,and it's new, then refresh it
      if (jwt && jwt !== token) {
        this.refreshAccessToken(jwt);
      }

      // Resolve the Promise --- we have to cast it to unknown first
      // so that TS doesn't complain about the lack of overlap with AxiosResponse<any>
      return Promise.resolve(response as unknown as { data: T });
    } catch (e) {
      // If we received an error
      if (e.response && e.response.status && e.response.status === 503) {
        throw new InMaintenance();
      }

      // If axios.request threw an error, this is *definitely* an error
      return Promise.reject(e);
    }
  };

  /**
   * Access token
   * @param  {String} token
   * @return {undefined}
   */
  refreshAccessToken: (token: string) => void = (token: string) => {
    window[getTokenAndStorage(window).storage].setItem("access_token", token);
  };
}
