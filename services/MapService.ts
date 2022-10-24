import { AreaWithNestedJsonInfo } from "types/map";
import BaseService, { Either } from "./BaseMonadicService";

export interface IMapService {
  changeLocation: (areaId: number) => Promise<Either<IChangeLocationResponse>>;
  fetch: () => Promise<Either<IFetchMapResponse>>;
}

export interface IChangeLocationResponse {
  area: AreaWithNestedJsonInfo;
  isSuccess: boolean;
  message: string;
}

export interface IFetchMapResponse {
  areas: AreaWithNestedJsonInfo[];
  currentArea: AreaWithNestedJsonInfo;
}

class MapService extends BaseService implements IMapService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetch = () => {
    const config = {
      url: "map",
    };
    return this.doRequest<IFetchMapResponse>(config);
  };

  /**
   * Change location
   * @param  {Number} areaId
   * @return {Promise}
   */
  changeLocation = (areaId: number) => {
    const config = {
      method: "post",
      url: "map/move",
      data: { areaId },
    };
    return this.doRequest<IChangeLocationResponse>(config);
  };
}

export { MapService as default };
