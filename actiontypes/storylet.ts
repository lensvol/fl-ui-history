// Fetch Storylets
export const FETCH_AVAILABLE_REQUESTED = "storylet/FETCH_AVAILABLE_REQUESTED";
export const FETCH_AVAILABLE_SUCCESS = "storylet/FETCH_AVAILABLE_SUCCESS";
export const FETCH_AVAILABLE_FAILURE = "storylet/FETCH_AVAILABLE_FAILURE";

// Fetch in background (reducers should understand this to mean that isFetching shouldn't be true)
export const FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED =
  "storylet/FETCH_IN_BACKGROUND_REQUESTED";

// Storylet IN
export const CHOOSE_STORYLET_REQUESTED = "storylet/CHOOSE_STORYLET_REQUESTED";
export const CHOOSE_STORYLET_SUCCESS = "storylet/CHOOSE_STORYLET_SUCCESS";
export const CHOOSE_STORYLET_FAILURE = "storylet/CHOOSE_STORYLET_FAILURE";

// Go back
export const GOBACK_REQUESTED = "storylet/GOBACK_REQUEST";
export const GOBACK_SUCCESS = "storylet/GOBACK_SUCCESS";
export const GOBACK_FAILURE = "storylet/GOBACK_FAILURE";

export const GO_BACK_FROM_SOCIAL_ACT = "storylet/GO_BACK_FROM_SOCIAL_ACT";

// Branches
export const CHOOSE_BRANCH_REQUESTED = "storylet/CHOOSE_BRANCH_REQUEST";
export const CHOOSE_BRANCH_SUCCESS = "storylet/CHOOSE_BRANCH_SUCCESS";
export const CHOOSE_BRANCH_FAILURE = "storylet/CHOOSE_BRANCH_FAILURE";

export const FINISH = "storylet/FINISH";
export const TRY_AGAIN = "storylet/TRY_AGAIN";

// Social Acts
export const SEND_SOCIAL_INVITATION_REQUESTED =
  "storylet/SEND_SOCIAL_INVITATION_REQUESTED";
export const SEND_SOCIAL_INVITATION_SUCCESS =
  "storylet/SEND_SOCIAL_INVITATION_SUCCESS";
export const SEND_SOCIAL_INVITATION_FAILURE =
  "storylet/SEND_SOCIAL_INVITATION_FAILURE";

// Fetch inelegible contacts
export const FETCH_INELIGIBLE_CONTACTS_REQUESTED =
  "storylet/FETCH_INELIGIBLE_CONTACTS_REQUESTED";
export const FETCH_INELIGIBLE_CONTACTS_SUCCESS =
  "storylet/FETCH_INELIGIBLE_CONTACTS_SUCCESS";
export const FETCH_INELIGIBLE_CONTACTS_FAILURE =
  "storylet/FETCH_INELIGIBLE_CONTACTS_FAILURE";

// Create plan
export const CREATE_PLAN_REQUESTED = "storylet/CREATE_PLAN_REQUESTED";
export const CREATE_PLAN_SUCCESS = "storylet/CREATE_PLAN_SUCCESS";
export const CREATE_PLAN_FAILURE = "storylet/CREATE_PLAN_FAILURE";

// Add new contact
export const ADD_NEW_CONTACT_REQUESTED = "storylet/ADD_NEW_CONTACT_REQUESTED";
export const ADD_NEW_CONTACT_SUCCESS = "storylet/ADD_NEW_CONTACT_SUCCESS";
export const ADD_NEW_CONTACT_FAILURE = "storylet/ADD_NEW_CONTACT_FAILURE";

// Rename quality
export const RENAME_QUALITY_REQUESTED = "storylet/RENAME_QUALITY_REQUESTED";
export const RENAME_QUALITY_SUCCESS = "storylet/RENAME_QUALITY_SUCCESS";
export const RENAME_QUALITY_FAILURE = "storylet/RENAME_QUALITY_FAILURE";

// Begin social event
export const BEGIN_SOCIAL_EVENT_REQUESTED =
  "storylet/BEGIN_SOCIAL_EVENT_REQUESTED";
export const BEGIN_SOCIAL_EVENT_SUCCESS = "storylet/BEGIN_SOCIAL_EVENT_SUCCESS";
export const BEGIN_SOCIAL_EVENT_FAILURE = "storylet/BEGIN_SOCIAL_EVENT_FAILURE";
export const BEGIN_SOCIAL_EVENT_UNAVAILABLE =
  "storylet/BEGIN_SOCIAL_EVENT_UNAVAILABLE";

// reset map updated
export const RESET_MAP_UPDATED = "storylet/RESET_MAP_UPDATED";

// Save edit plan
export const DELETE_PLAN_REQUESTED = "storylet/DELETE_PLAN_REQUESTED";
export const DELETE_PLAN_SUCCESS = "storylet/DELETE_PLAN_SUCCESS";
export const DELETE_PLAN_FAILURE = "storylet/DELETE_PLAN_FAILURE";

export const SET_SHOULD_UPDATE = "storylet/SET_SHOULD_UPDATE";

// Use qualiy
export const USE_QUALITY_REQUESTED = "storylet/USE_QUALITY_REQUESTED";
export const USE_QUALITY_SUCCESS = "storylet/USE_QUALITY_SUCCESS";
export const USE_QUALITY_FAILURE = "storylet/USE_QUALITY_FAILURE";
export const CANNOT_USE_QUALITY = "storylet/CANNOT_USE_QUALITY";

// Clear cache
export const CLEAR_CACHE = "storylet/CLEAR_CACHE";

// Put 'In' storylet
export const PUT_IN = "storylet/PUT_IN";

// close dialog
export const CLOSE_CANNOTUSE_DIALOG = "storylet/CLOSE_CANNOTUSE_DIALOG";

// branch fate controls
export const OPEN_REFRESH_DIALOG = "storylet/OPEN_REFRESH_DIALOG";
export const OPEN_FATE_PURCHASE = "storylet/OPEN_FATE_PURCHASE";
