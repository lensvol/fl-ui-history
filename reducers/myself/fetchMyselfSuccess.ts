import createCategories from "./createCategories";
import createQualities from "./createQualities";
import {
  IFetchMyselfResponseData,
  IMyselfState,
  UIRestriction,
} from "types/myself";

export default function fetchMyselfSuccess(
  state: IMyselfState,
  payload: IFetchMyselfResponseData
): IMyselfState {
  const { possessions, restrictedUserInterfaceElements } = payload;

  const mantelpieceItemId = payload.character.mantelpieceItem?.id;
  const scrapbookStatusId = payload.character.scrapbookStatus?.id;

  return {
    ...state,
    hasFetched: true,
    isFetching: false,
    character: {
      ...state.character,
      ...payload.character,
      mantelpieceItemId,
      scrapbookStatusId,
    },
    categories: createCategories(possessions),
    qualities: createQualities(possessions),
    uiRestrictions: restrictedUserInterfaceElements?.map(
      (restriction) => UIRestriction[restriction as keyof typeof UIRestriction]
    ),
  };
}
