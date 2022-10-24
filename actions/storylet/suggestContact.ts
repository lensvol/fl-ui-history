import { handleVersionMismatch } from "actions/versionSync";
import { VersionMismatch } from "services/BaseService";
import StoryletService, { IStoryletService } from "services/StoryletService";

export default suggestContact(new StoryletService());

export function suggestContact(service: IStoryletService) {
  return (branchId: number) => async (dispatch: Function) => {
    try {
      const { data } = await service.suggestContact(branchId);
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      throw error;
    }
  };
}
