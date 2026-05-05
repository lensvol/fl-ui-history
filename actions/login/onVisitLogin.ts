import { handleVersionMismatch } from "actions/versionSync";

import { VersionMismatch } from "services/BaseService";
import LoginService, { ILoginService } from "services/LoginService";

export default onVisitLogin(new LoginService());

export function onVisitLogin(service: ILoginService) {
  return () => async (dispatch: Function) => {
    try {
      const result = await service.onVisitLogin();

      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));

        return;
      }

      throw e;
    }
  };
}
