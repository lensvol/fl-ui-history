import { updateMyself } from "actions/myself";
import { ApiResultMessageQualityEffect } from "types/app/messages";
import { IQuality } from "types/qualities";
import { ThunkDispatch } from "redux-thunk";

type HasPossessionQuality = {
  possession: IQuality;
};

export default function processStandardMessages(
  standardMessages: ApiResultMessageQualityEffect[]
) {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    const qualityEffects: HasPossessionQuality[] = standardMessages
      .filter((m) => hasPossession(m))
      .map((m) => m as HasPossessionQuality) // wtf? the filter should have fixed this for us
      .map((m) => ({ possession: m.possession }));

    dispatch(updateMyself(qualityEffects));
  };
}

function hasPossession(x: {
  possession?: IQuality | undefined;
}): x is HasPossessionQuality {
  return x.possession !== undefined;
}
