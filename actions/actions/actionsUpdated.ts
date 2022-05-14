import { ACTIONS_UPDATED } from 'actiontypes/actions';

export type ActionsUpdated = { type: typeof ACTIONS_UPDATED, payload: { actions: number } };

export default function actionsUpdated({ actions }: { actions: number }): ActionsUpdated {
  return {
    type: ACTIONS_UPDATED,
    payload: { actions },
  };
}