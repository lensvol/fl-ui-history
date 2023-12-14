import BaseService from "./BaseService";
import {
  ICreatePlanRequestData,
  IEditPlanRequestData,
  IPlansService,
} from "types/plans";

class PlansService extends BaseService implements IPlansService {
  /**
   * Create Plan
   * @return {Promise}
   * @param branchData
   */
  createPlan = (branchData: ICreatePlanRequestData) => {
    const config = {
      method: "post",
      url: "/plan/create",
      data: {
        branchId: branchData.id,
        planKey: branchData.planKey,
      },
    };
    return this.doRequest(config);
  };

  /**
   * Fetch
   * @return {Promise}
   */
  fetchPlans = () => {
    const config = {
      method: "get",
      url: "/plan",
    };
    return this.doRequest(config);
  };

  /**
   * Delete plan
   * @param  {Number} branchId
   * @return {Promise}
   */
  deletePlan = (branchId: number) => {
    const config = {
      method: "post",
      url: "plan/delete",
      data: { branchId },
    };
    return this.doRequest(config);
  };

  /**
   * Create Plan
   * @param  {Object} planData
   * @return {Promise}
   */
  editPlan = (planData: IEditPlanRequestData = {}) => {
    const config = {
      method: "post",
      url: "plan/update",
      data: {
        branchId: planData.branch?.id,
        notes: planData.noteInput,
        refresh: planData.refresh,
      },
    };
    return this.doRequest(config);
  };
}

export { PlansService as default };
