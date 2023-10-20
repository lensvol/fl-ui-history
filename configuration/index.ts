/* eslint-disable import/no-mutable-exports */

import { IConfig } from "types/config";
import localConfig from "./local.json";
import stagingConfig from "./staging.json";
import productionConfig from "./production.json";
import { version } from "../../package.json";
import betaConfig from "./beta.json";

const nodeEnv = process.env.REACT_APP_ENV;

let Config: IConfig;

switch (nodeEnv) {
  case "staging":
    Config = { ...stagingConfig, version };
    // Config = { ...productionConfig, version };
    break;

  case "local":
    Config = { ...localConfig, version };
    break;

  case "production":
    Config = { ...productionConfig, version };
    break;

  case "beta":
    Config = { ...betaConfig, version };
    break;

  default:
    // Config = { ...productionConfig, version };
    Config = { ...stagingConfig, version };
}

export default Config;
