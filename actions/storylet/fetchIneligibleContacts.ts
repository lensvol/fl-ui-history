import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import * as StoryletActionTypes from "actiontypes/storylet";
import StoryletService from "services/StoryletService";
import { IneligibleContact } from "types/storylet";

export type FetchIneligibleContactsRequestedAction = {
  type: typeof StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_REQUESTED;
};

export type FetchIneligibleContactsSuccessAction = {
  type: typeof StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_SUCCESS;
  payload: {
    ineligibleContacts: IneligibleContact[];
  };
};

export type FetchIneligibleContactsFailureAction = {
  type: typeof StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_FAILURE;
  error: boolean;
  status?: number;
};

export type FetchIneligibleContactsAction =
  | FetchIneligibleContactsRequestedAction
  | FetchIneligibleContactsFailureAction
  | FetchIneligibleContactsSuccessAction;

const fetchIneligibleContactsRequested: ActionCreator<
  FetchIneligibleContactsRequestedAction
> = () => ({
  type: StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_REQUESTED,
});

const fetchIneligibleContactsSuccess: ActionCreator<
  FetchIneligibleContactsSuccessAction
> = (data: { ineligibleContacts: IneligibleContact[] }) => ({
  type: StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_SUCCESS,
  payload: {
    ineligibleContacts: data.ineligibleContacts,
  },
});

const fetchIneligibleContactsFailure: ActionCreator<
  FetchIneligibleContactsFailureAction
> = (error: any) => ({
  type: StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_FAILURE,
  error: true,
  status: error?.response?.any,
});

const service = new StoryletService();

/** ----------------------------------------------------------------------------
 * FETCH INELIGIBLE CONTACTS
 -----------------------------------------------------------------------------*/
export default function fetchIneligibleContacts(branchId: number) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(fetchIneligibleContactsRequested());

    try {
      const { data } = await service.fetchIneligibleContacts(branchId);
      dispatch(fetchIneligibleContactsSuccess(data));
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(fetchIneligibleContactsFailure(error));
    }
  };
}
