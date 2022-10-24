import { FetchSharedContentSuccess } from "actions/profile/fetchSharedContent";
import { IProfileState } from "types/profile";

export default function fetchSharedContentSuccess(
  state: IProfileState,
  action: FetchSharedContentSuccess
) {
  const { next, prev, shares: sharedContent } = action.payload;

  return {
    ...state,
    next,
    prev,
    sharedContent,
  };
}
