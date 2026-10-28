import { ActionCreator, Dispatch } from "redux";

import { MYSELF_CHANGED } from "actiontypes/myself";

import { QualityChangeType } from "types/app/messages";
import { IQuality } from "types/qualities";

export type UpdateMyself = {
  type: typeof MYSELF_CHANGED;
  payload: UpdateMyselfData;
};

type UpdateMyselfData = {
  possession: IQuality;
  changeType?: QualityChangeType;
}[];

const myselfChanged: ActionCreator<UpdateMyself> = (
  data: UpdateMyselfData
) => ({
  type: MYSELF_CHANGED,
  payload: data,
});

export default function updateMyself(wrappedPossessions: UpdateMyselfData) {
  return (dispatch: Dispatch) => dispatch(myselfChanged(wrappedPossessions));
}
