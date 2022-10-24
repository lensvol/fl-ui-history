/* eslint-disable import/prefer-default-export */

import { MessageVia } from "services/SettingsService";

export enum AccountLinkReminderStep {
  Ready,
  Success,
}

export const SUPPORTED_LINK_METHODS: MessageVia[] = [
  "Email",
  "Facebook",
  "Google",
  "Twitter",
];
