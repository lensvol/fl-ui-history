import { handleVersionMismatch } from "actions/versionSync";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import RegisterService from "services/RegisterService";

export default checkAvailability(new RegisterService());

export function checkAvailability(service: RegisterService) {
  return (name: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const { data } = await service.checkAvailability(name);
      return data;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      throw e;
    }
  };
}
