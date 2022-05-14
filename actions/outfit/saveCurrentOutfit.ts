import { fetchOutfitSuccess } from 'actions/outfit/fetchOutfit';
import { handleVersionMismatch } from 'actions/versionSync';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import OutfitService from 'services/OutfitService';

export default function saveCurrentOutfit() {
  return async (dispatch: Function) => {
    try {
      const result = await new OutfitService().saveCurrentOutfit();
      if (result instanceof Success) {
        dispatch(fetchOutfitSuccess(result.data));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      throw error;
    }
  };
}