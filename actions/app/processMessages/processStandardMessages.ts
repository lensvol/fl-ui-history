import { ThunkDispatch } from "redux-thunk";

import { updateMyself } from "actions/myself";

import {
  ApiResultMessageQualityEffect,
  QualityChangeType,
} from "types/app/messages";
import { IQuality } from "types/qualities";

type HasPossessionQuality = {
  possession: IQuality;
  changeType?: QualityChangeType;
};

export default function processStandardMessages(
  standardMessages: ApiResultMessageQualityEffect[]
) {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    const qualityEffects: HasPossessionQuality[] = standardMessages
      .filter((m) => hasPossession(m))
      .map((m) => ({
        changeType: m.changeType,
        possession: m.possession!,
      }));

    dispatch(updateMyself(qualityEffects));
  };
}

function hasPossession(m: {
  possession?: IQuality;
}): m is HasPossessionQuality {
  return m.possession !== undefined;
}
