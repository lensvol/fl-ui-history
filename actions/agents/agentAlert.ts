import { ActionCreator } from "redux";

import {
  HIDE_AGENT_ALERT_NOTIFCATION,
  HIDE_ALL_AGENT_ALERTS_NOTIFCATION,
  UNHIDE_AGENT_ALERT_NOTIFCATION,
} from "actiontypes/agents";

export type HideAgentAlertNotification = {
  type: typeof HIDE_AGENT_ALERT_NOTIFCATION;
  payload: {
    alertId: number;
  };
};

export type HideAllAgentAlertsNotification = {
  type: typeof HIDE_ALL_AGENT_ALERTS_NOTIFCATION;
};

export type UnhideAgentAlertNotification = {
  type: typeof UNHIDE_AGENT_ALERT_NOTIFCATION;
  payload: {
    alertId: number;
  };
};

export const hideAgentAlert: ActionCreator<HideAgentAlertNotification> = (
  alertId: number
) => ({
  type: HIDE_AGENT_ALERT_NOTIFCATION,
  payload: {
    alertId,
  },
});

export const hideAllAgentAlerts: ActionCreator<
  HideAllAgentAlertsNotification
> = () => ({
  type: HIDE_ALL_AGENT_ALERTS_NOTIFCATION,
});

export const unhideAgentAlert: ActionCreator<UnhideAgentAlertNotification> = (
  alertId: number
) => ({
  type: UNHIDE_AGENT_ALERT_NOTIFCATION,
  payload: {
    alertId,
  },
});
