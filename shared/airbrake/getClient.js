/* eslint-disable no-param-reassign */
import { Notifier } from "@airbrake/browser";

import Config from "configuration";

import {
  isExtensionContextInvalidated,
  isGreasemonkeyError,
  isNetworkError,
  isTimeoutOf0ms,
} from "shared/airbrake/filters";

let instance = null;

export default function getClient() {
  if (!instance) {
    const airbrake = new Notifier({
      projectId: 175794,
      projectKey: "7f518739d29b3fe03280cdb1f8f90c85",
    });

    airbrake.addFilter((notice) => {
      notice.context.environment = Config.environment;
      notice.context.version = Config.version;

      if (!(notice.errors && notice.errors.length)) {
        return notice;
      }

      const error = notice.errors[0];

      const filters = [
        isExtensionContextInvalidated,
        isGreasemonkeyError,
        isNetworkError,
        isTimeoutOf0ms,
      ];

      // If one of our filters returns true, then return null (don't submit to Airbrake)
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];

        if (filter(error)) {
          return null;
        }
      }

      return notice;
    });

    instance = airbrake;
  }

  return instance;
}
