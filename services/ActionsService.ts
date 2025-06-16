import BaseService, { Either } from "services/BaseMonadicService";

import {
  IActionsService,
  FetchActionsResponse,
  ResetChronographResponse,
} from "types/actions";

export default class ActionsService
  extends BaseService
  implements IActionsService
{
  fetchActions: () => Promise<Either<FetchActionsResponse>> = () => {
    const config = {
      method: "get",
      url: "/character/actions",
    };

    return this.doRequest<FetchActionsResponse>(config);
  };

  resetChronograph: () => Promise<Either<ResetChronographResponse>> = () => {
    const config = {
      method: "get",
      url: "/character/resetchrono",
    };

    return this.doRequest<ResetChronographResponse>(config);
  };
}
