import { ThunkDispatch } from "redux-thunk";

import { handleVersionMismatch } from "actions/versionSync";

import { VersionMismatch } from "services/BaseService";
import RegisterService, { IRegisterService } from "services/RegisterService";

export default confirmEmail(new RegisterService());

export function confirmEmail(service: IRegisterService) {
  return (request: any) => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const { data } = await service.confirmEmail(request);

      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      return error;
    }
  };
}
