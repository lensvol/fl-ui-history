import { handleVersionMismatch } from "actions/versionSync";
import * as StoryletActionTypes from "actiontypes/storylet";
import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from "services/StoryletService";

export type RenameQualityRequestedAction = {
  type: typeof StoryletActionTypes.RENAME_QUALITY_REQUESTED;
};

export type RenameQualitySuccessAction = {
  type: typeof StoryletActionTypes.RENAME_QUALITY_SUCCESS;
  payload: IApiStoryletResponseData;
};

export type RenameQualityFailureAction = {
  type: typeof StoryletActionTypes.RENAME_QUALITY_FAILURE;
};

export type RenameQualityAction =
  | RenameQualityRequestedAction
  | RenameQualityFailureAction
  | RenameQualitySuccessAction;

/** ----------------------------------------------------------------------------
 * RENAME QUALITY
 -----------------------------------------------------------------------------*/
export default renameQuality(new StoryletService());

export function renameQuality(service: IStoryletService) {
  return (stuff: any) => async (dispatch: Function) => {
    dispatch(renameQualityRequested());
    try {
      const { data } = await service.renameQuality(stuff);
      dispatch(renameQualitySuccess(data));
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(renameQualityFailure());
    }
  };
}

const renameQualityRequested = () => ({
  type: StoryletActionTypes.RENAME_QUALITY_REQUESTED,
  isRenaming: true,
});

const renameQualitySuccess = (data: any) => ({
  type: StoryletActionTypes.RENAME_QUALITY_SUCCESS,
  isRenaming: false,
  payload: {
    rename: data.rename,
    phase: data.phase,
    endStorylet: data.endStorylet,
    messages: data.messages,
  },
});

const renameQualityFailure = (/* error */) => ({
  type: StoryletActionTypes.RENAME_QUALITY_FAILURE,
  isRenaming: false,
});
