import { IActionsState } from 'types/actions';

export default function fetchActionsSuccess(state: IActionsState, payload: { actions: number, actionBankSize: number }) {
  return {
    ...state,
    actions: payload.actions,
    actionBankSize: payload.actionBankSize,
    error: undefined,
    isFetching: false,
  };
}