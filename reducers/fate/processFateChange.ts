import { ProcessFateChange } from "actions/app/processFateChange";
import { IFateState } from "reducers/fate/index";

export default function processFateChange(
  state: IFateState,
  action: ProcessFateChange
): IFateState {
  const {
    payload: { fateChangeAmount },
  } = action;
  return {
    ...state,
    data: {
      ...state.data,
      currentFate: state.data.currentFate + fateChangeAmount,
    },
  };
}
