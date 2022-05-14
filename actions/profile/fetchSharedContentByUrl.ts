import { handleVersionMismatch } from 'actions/versionSync';
import { Either, Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import ProfileService, { FetchSharedContentResponse, IProfileService } from 'services/ProfileService';

import {
  fetchSharedContentRequested,
  fetchSharedContentSuccess,
} from 'actions/profile/fetchSharedContent';

export default fetchSharedContentByUrl(new ProfileService());

export function fetchSharedContentByUrl(service: IProfileService) {
  return (url: string): (dispatch: Function) => Promise<Either<FetchSharedContentResponse> | VersionMismatch> => {
    return async (dispatch: Function) => {
      dispatch(fetchSharedContentRequested());
      try {
        const result = await service.fetchSharedContentByUrl(url);
        if (result instanceof Success) {
          dispatch(fetchSharedContentSuccess(result.data));
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
  };
}