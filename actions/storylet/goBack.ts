import { handleVersionMismatch } from "actions/versionSync";
import * as StoryletActionTypes from "actiontypes/storylet";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
} from "services/StoryletService";

import { processMessages } from "actions/app";
import { fetch as fetchCards } from "actions/cards";
import { fetchAvailableSuccess } from "./fetchAvailable";

export type GoBackFailureAction = {
  type: typeof StoryletActionTypes.GOBACK_FAILURE;
  error: boolean;
  status?: number;
};

export type GoBackRequestedAction = {
  type: typeof StoryletActionTypes.GOBACK_REQUESTED;
};

export type GoBackSuccessAction = {
  type: typeof StoryletActionTypes.GOBACK_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    "actions" | "canChangeOutfit" | "phase"
  >;
};

export type GoBackOptions = {
  fetchOpportunityCards?: boolean;
};

const goBackRequest: ActionCreator<GoBackRequestedAction> = () => ({
  type: StoryletActionTypes.GOBACK_REQUESTED,
});

export const goBackSuccess: ActionCreator<GoBackSuccessAction> = ({
  actions,
  canChangeOutfit,
  phase,
}: Pick<
  IApiStoryletResponseData,
  "actions" | "canChangeOutfit" | "phase"
>) => ({
  type: StoryletActionTypes.GOBACK_SUCCESS,
  payload: {
    actions,
    canChangeOutfit,
    phase,
  },
});

const goBackFailure = (error: any) => ({
  type: StoryletActionTypes.GOBACK_FAILURE,
  error: true,
  status: error.response?.status,
});

const service = new StoryletService();

/** ----------------------------------------------------------------------------
 * GO BACK (Perhaps not)
 -----------------------------------------------------------------------------*/
export default function goBack({ fetchOpportunityCards }: GoBackOptions = {}) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(goBackRequest());

    // Fetch opp cards, just in case something interesting has happened
    // (e.g. St Arthur's Candle, which adds a card to your hand)
    if (fetchOpportunityCards ?? true) {
      dispatch(fetchCards({ background: true }));
    }

    try {
      // Make the request to the API
      const { data } = await service.goBack();

      const { isSuccess, messages } = data;

      // TODO: is this the right thing to do?
      if (!isSuccess) {
        throw new Error();
      }

      // If there were some messages in the response, then process them
      if (messages) {
        dispatch(processMessages(messages));
      }
      // Dispatch the success event
      dispatch(goBackSuccess(data));

      // Treat the response as if it were the result of fetchAvailable
      dispatch(fetchAvailableSuccess(data));
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(goBackFailure(error));
    }
  };
}
