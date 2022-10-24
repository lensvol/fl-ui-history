import * as MysteriesActionTypes from "../actiontypes/mysteries";

/**
 * Iniitial state
 * @type {Object}
 */
const initialState = {
  isFetching: false,
  isSaving: false,
  isSuccess: false,
  mysteries: null,
  message: null,
};

/**
 * Mysteries Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
const Mysteries = (state = initialState, action) => {
  const { payload = {} } = action;

  switch (action.type) {
    case MysteriesActionTypes.FETCH_MYSTERIES_REQUESTED:
    case MysteriesActionTypes.FETCH_MYSTERIES_FAILURE:
      return {
        ...state,
        isFetching: action.isFetching,
        message: null,
      };

    case MysteriesActionTypes.FETCH_MYSTERIES_SUCCESS:
      return {
        ...state,
        isFetching: action.isFetching,
        mysteries: payload,
      };

    case MysteriesActionTypes.ANSWER_MYSTERY_REQUESTED:
    case MysteriesActionTypes.ANSWER_MYSTERY_FAILURE:
      return {
        ...state,
        isSaving: action.isSaving,
        isSuccess: false,
      };

    case MysteriesActionTypes.ANSWER_MYSTERY_SUCCESS: {
      const updatedMysteries = action.mysteries.map((mystery) => ({
        ...mystery,
        isSuccess: mystery.id === payload.id,
      }));

      return {
        ...state,
        isSaving: action.isSaving,
        isSuccess: {
          ...state.mysteries,
          updatedMysteries,
        },
        message: payload.message,
        mysteries: updatedMysteries,
      };
    }

    case MysteriesActionTypes.REFRESH_MYSTERIES: {
      const mysteries = state.mysteries.map((mystery) => ({
        ...mystery,
        isSuccess: false,
      }));

      return {
        ...state,
        mysteries,
      };
    }

    default:
      return state;
  }
};

export default Mysteries;
