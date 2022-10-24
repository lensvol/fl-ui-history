import { MYSELF_CHANGED } from "actiontypes/myself";
import { IQuality } from "types/qualities";
import { ActionCreator, Dispatch } from "redux";

export type UpdateMyself = {
  type: typeof MYSELF_CHANGED;
  payload: UpdateMyselfData;
};

type UpdateMyselfData = { possession: IQuality }[];

const myselfChanged: ActionCreator<UpdateMyself> = (
  data: UpdateMyselfData
) => ({
  type: MYSELF_CHANGED,
  payload: data,
});

export default function updateMyself(
  wrappedPossessions: { possession: IQuality }[]
) {
  return (dispatch: Dispatch) => dispatch(myselfChanged(wrappedPossessions));
}
