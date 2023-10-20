import { DeleteEntrySuccess } from "actions/profile/deleteEntry";
import { IProfileState } from "types/profile";

export default function deleteEntrySuccess(
  state: IProfileState,
  action: DeleteEntrySuccess
) {
  const { toDelete } = action.payload;

  return {
    ...state,
    isFetching: false,
    sharedContent: state.sharedContent.filter(({ id }) => id !== toDelete),
  };
}
