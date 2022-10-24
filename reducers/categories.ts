import { FetchCategoriesSuccess } from "actions/categories/fetchCategories";
import { FetchMyselfSuccess } from "actions/myself/fetchMyself";
import { FETCH_CATEGORIES_SUCCESS } from "actiontypes/categories";
import { FETCH_MYSELF_SUCCESS } from "actiontypes/myself";
import { Nature } from "types/qualities";

export type ICategoriesState = {
  Status: string[];
  Thing: string[];
};

export const INITIAL_STATE: ICategoriesState = {
  Status: [],
  Thing: [],
};

type CategoriesReducerActions = FetchCategoriesSuccess | FetchMyselfSuccess;

export default function reducer(
  state: ICategoriesState = INITIAL_STATE,
  action: CategoriesReducerActions
) {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS: {
      return fetchCategoriesSuccess(state, action);
    }

    case FETCH_MYSELF_SUCCESS: {
      return fetchMyselfSuccess(state, action);
    }

    default:
      return state;
  }
}

function fetchCategoriesSuccess(
  state: ICategoriesState,
  action: FetchCategoriesSuccess
) {
  return {
    ...state,
    Status: action.payload.status,
    Thing: action.payload.thing,
  };
}

function fetchMyselfSuccess(
  state: ICategoriesState,
  action: FetchMyselfSuccess
) {
  const all: { [key in Nature]: string[] } = {
    Thing: [...state.Thing],
    Status: [...state.Status],
  };
  // Iterate over all qualities;
  const { possessions: categories } = action.payload;
  for (let i = 0; i < categories.length; i++) {
    const { possessions: qualities } = categories[i];
    for (let j = 0; j < qualities.length; j++) {
      const { category, nature } = qualities[j];
      if (all[nature]?.indexOf(category) >= 0) {
        continue;
      }
      // Handle Election Career and other odd things
      if ((nature as Nature | "DerivedQuality") === "DerivedQuality") {
        if (all["Thing"].indexOf(category) < 0) {
          all.Thing.push(category);
        }
        continue;
      }
      all[nature].push(category);
    }
  }

  return {
    ...state,
    Thing: all.Thing,
    Status: all.Status,
  };
}
