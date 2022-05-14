import { handleVersionMismatch } from 'actions/versionSync';
import { FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from 'actiontypes/categories';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import CategoriesService, { FetchCategoriesResponse } from 'services/CategoriesService';

export type FetchCategoriesFailure = { type: typeof FETCH_CATEGORIES_FAILURE };
export type FetchCategoriesSuccess = { type: typeof FETCH_CATEGORIES_SUCCESS, payload: FetchCategoriesResponse };

export type FetchCategoriesActions = FetchCategoriesSuccess | FetchCategoriesFailure;

export const fetchCategoriesFailure: ActionCreator<FetchCategoriesFailure> = () => ({
  type: FETCH_CATEGORIES_FAILURE,
});

export const fetchCategoriesSuccess: ActionCreator<FetchCategoriesSuccess> = (data: FetchCategoriesResponse) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: data,
});

export default function fetchCategories() {
  return async (dispatch: ThunkDispatch<Either<FetchCategoriesResponse>, any, any>) => {
    try {
      const result = await (new CategoriesService()).fetchCategories();

      if (result instanceof Success) {
        dispatch(fetchCategoriesSuccess(result.data));
      } else {
        dispatch(fetchCategoriesFailure());
      }

      return result;
    } catch (error) {
      dispatch(fetchCategoriesFailure());

      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }

      if (error?.response?.status === 404) {
        console.warn('Categories endpoint missing; continuing');
      }
      throw error;
    }
  };
}
