import { handleVersionMismatch } from 'actions/versionSync';
import { ThunkDispatch } from 'redux-thunk';
import { VersionMismatch } from 'services/BaseService';
import * as StoryletActionTypes from 'actiontypes/storylet';
import StoryletService, {
  ApiAddContactRequest,
  ApiActInviteeSelection,
  IStoryletService,
} from 'services/StoryletService';

export type AddNewContactRequestedAction = {
  type: typeof StoryletActionTypes.ADD_NEW_CONTACT_REQUESTED,
};

export type AddNewContactSuccessAction = {
  type: typeof StoryletActionTypes.ADD_NEW_CONTACT_SUCCESS,
  payload: Pick<ApiActInviteeSelection, 'addedFriendId' | 'eligibleFriends' | 'message' >,
};

export type AddNewContactFailureAction = {
  type: typeof StoryletActionTypes.ADD_NEW_CONTACT_FAILURE,
};

export type AddNewContactAction =
  AddNewContactRequestedAction
  | AddNewContactFailureAction
  | AddNewContactSuccessAction;

const addNewContactRequest = () => ({
  type: StoryletActionTypes.ADD_NEW_CONTACT_REQUESTED,
  isSaving: true,
});

const addNewContactSuccess = (data: ApiActInviteeSelection) => ({
  type: StoryletActionTypes.ADD_NEW_CONTACT_SUCCESS,
  payload: {
    addedFriendId: data.addedFriendId,
    eligibleFriends: data.eligibleFriends,
    message: data.message,
  },
});

const addNewContactFailure = (/* error */) => ({
  type: StoryletActionTypes.ADD_NEW_CONTACT_FAILURE,
  isSaving: false,
  error: true, // ,
  // status: error.response && error.response.status
});

export default addNewContact(new StoryletService());

export function addNewContact(service: IStoryletService) {
  return (contactData: ApiAddContactRequest) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(addNewContactRequest());
    try {
      const { data } = await service.addNewContact(contactData);
      dispatch(addNewContactSuccess(data));
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      return dispatch(addNewContactFailure());
    }
  };
}
