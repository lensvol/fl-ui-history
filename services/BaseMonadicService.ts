import axios, { AxiosInstance } from "axios";
import Config from "configuration";
import { VersionMismatch } from "services/BaseService";
import { getTokenAndStorage } from "features/startup";
import semver from "semver";

export class Success<T> {
  data: T;

  constructor(result: T) {
    this.data = result;
  }
}

export class Failure {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export type Either<T> = Success<T> | Failure;

export default class BaseService {
  axiosInstance: AxiosInstance;

  config: any;

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

  refreshAccessToken: (token: string) => void = (token: string) => {
    window[getTokenAndStorage(window).storage].setItem("access_token", token);
  };

  // eslint-disable-next-line arrow-parens
  doRequest: <T = any>(config: any) => Promise<Either<T>> = async <T = any>(
    config: any
  ) => {
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

    // Make the request!
    const response = await this.axiosInstance.request(configData);

    // Check the latest client version available
    const latestVersion = response.headers["x-latest-available-client-version"];

    // We're only interested in major.minor.patch versions here; if those match,
    // we're happy (this is not intended to check compatibility between dev branches
    // and the API)
    const coercedLatestVersion = semver.coerce(latestVersion)?.version;
    const coercedCurrentVersion = semver.coerce(Config.version)?.version;

    // It's OK for the client to be a version ahead of the server, but
    // if it's behind, throw a VersionMismatch error
    if (
      coercedCurrentVersion &&
      coercedLatestVersion &&
      !semver.gte(coercedCurrentVersion, coercedLatestVersion)
    ) {
      throw new VersionMismatch(latestVersion);
    }

    // Look for a JWT in the response
    const jwt = response.data?.jwt;

    // If there's a JWT ,and it's new, then refresh it
    if (jwt && jwt !== token) {
      this.refreshAccessToken(jwt);
    }

    // If isSuccess is true, we succeeded; if isSuccess is missing, then
    // the request can only succeed or throw
    if (response.data?.isSuccess ?? true) {
      return new Success<T>(response.data as T);
    }

    // This request failed for some reason; let the caller deal with it
    return new Failure(response.data?.message);
  };
}
