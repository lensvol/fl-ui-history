import { fetchMyself } from 'actions/myself';
import { fetchOutfit } from 'actions/outfit';
import { handleVersionMismatch } from 'actions/versionSync';
import { VersionMismatch } from 'services/BaseService';
import StoryletService, {
  IApiStoryletResponseData,
  IChooseBranchRequestData,
} from 'services/StoryletService';
import { ApiQualityRequirement } from 'types/storylet';
import { ThunkDispatch } from 'redux-thunk';

type ChooseBranchRequestDataWithQReqs = IChooseBranchRequestData & {
  qualityRequirements?: ApiQualityRequirement[],
};

export default function chooseGateEventBranch(requestData: ChooseBranchRequestDataWithQReqs) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const service = new StoryletService();
      // Check whether the branch being has cost-type requirements. We will not
      // receive cost-related quality updates in the API response, so we need to
      // prepare to trigger fetches of the character's myself+outfit qualities
      const { qualityRequirements = [] } = requestData;
      const hasCosts = qualityRequirements.some((qreq: ApiQualityRequirement) => (qreq.isCost ?? false));

      // Make the request
      const { data }: { data: IApiStoryletResponseData } = await service.chooseBranch(requestData);

      // If this branch incurred a cost, then fetch outfit + possessions too
      if (hasCosts) {
        dispatch(fetchMyself());
        dispatch(fetchOutfit());
      }
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