import { AddNewContactAction } from "actions/storylet/addNewContact";
import { ChooseBranchSuccessAction } from "actions/storylet/chooseBranch/chooseBranchSuccess";
import { FetchIneligibleContactsAction } from "actions/storylet/fetchIneligibleContacts";
import { SendSocialInviteAction } from "actions/storylet/sendSocialinvite";

import {
  ADD_NEW_CONTACT_SUCCESS,
  CHOOSE_BRANCH_SUCCESS,
  FETCH_INELIGIBLE_CONTACTS_SUCCESS,
  SEND_SOCIAL_INVITATION_FAILURE,
  SEND_SOCIAL_INVITATION_REQUESTED,
  SEND_SOCIAL_INVITATION_SUCCESS,
} from "actiontypes/storylet";
import { ApiActInviteeSelection } from "services/StoryletService";
import { IBranch, IEligibleFriend, IneligibleContact } from "types/storylet";

export type ISocialActState = {
  actMessagePreview: string | undefined;
  branch: IBranch | undefined;
  eligibleFriends?: IEligibleFriend[];
  ineligibleContacts: IneligibleContact[];
  inviteeData: ApiActInviteeSelection | undefined;
  isSending: boolean;
  selectedContactId: number | undefined;
};

const INITIAL_STATE: ISocialActState = {
  actMessagePreview: undefined,
  branch: undefined,
  eligibleFriends: [],
  ineligibleContacts: [],
  inviteeData: undefined,
  isSending: false,
  selectedContactId: undefined,
};

type SocialActActions =
  | AddNewContactAction
  | ChooseBranchSuccessAction
  | FetchIneligibleContactsAction
  | SendSocialInviteAction;

export default function reducer(
  state: ISocialActState = INITIAL_STATE,
  action: SocialActActions
): ISocialActState {
  switch (action.type) {
    case ADD_NEW_CONTACT_SUCCESS: {
      return {
        ...state,
        eligibleFriends: action.payload.eligibleFriends,
      };
    }

    case CHOOSE_BRANCH_SUCCESS:
      if (action.payload.eligibleFriends) {
        return {
          ...state,
          ...action.payload.socialAct,
          eligibleFriends: action.payload.eligibleFriends,
        };
      }
      return { ...state, ...action.payload.socialAct };

    case FETCH_INELIGIBLE_CONTACTS_SUCCESS:
      return {
        ...state,
        ineligibleContacts: (
          action.payload as { ineligibleContacts: IneligibleContact[] }
        ).ineligibleContacts,
      };

    case SEND_SOCIAL_INVITATION_FAILURE:
      return { ...state, isSending: false };

    case SEND_SOCIAL_INVITATION_REQUESTED:
      return { ...state, isSending: true };

    case SEND_SOCIAL_INVITATION_SUCCESS:
      return { ...state, isSending: false };

    default:
      return state;
  }
}
