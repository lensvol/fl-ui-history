import { ThunkDispatch } from "redux-thunk";

import { handleVersionMismatch } from "actions/versionSync";

import { VersionMismatch } from "services/BaseService";
import { Either } from "services/BaseMonadicService";
import SettingsService, {
  ISettingsService,
  UnsubscribeResponse,
} from "services/SettingsService";

export default unsubscribe(new SettingsService());

export function unsubscribe(service: ISettingsService) {
  return (request: any) =>
    async (dispatch: ThunkDispatch<Either<UnsubscribeResponse>, any, any>) => {
      try {
        const response = await service.unsubscribe(request);

        return response;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));

          return error;
        }

        return error;
      }
    };
}
