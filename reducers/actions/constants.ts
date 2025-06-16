/* eslint-disable import/prefer-default-export */
import { IActionsState } from "types/actions";

export const INITIAL_STATE: IActionsState = {
  actionBankSize: 0,
  actions: 0,
  error: undefined,
  isFetching: false,
  chronograph: {
    isVisible: false,
    actionCount: 0,
  },
};

export const CHRONOGRAPH_IDENTIFIER = 146234;
