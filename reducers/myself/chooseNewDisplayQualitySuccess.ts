import { ChooseNewDisplayQualitySuccess } from 'actions/myself/chooseNewDisplayQualitySuccess';
import { IMyselfState } from 'types/myself';

export default function chooseNewDisplayQualitySuccess(
  state: IMyselfState,
  action: ChooseNewDisplayQualitySuccess,
  key: 'mantelpieceItemId' | 'scrapbookStatusId',
): IMyselfState {
  const { id } = action.payload;
  return {
    ...state,
    character: {
      ...state.character,
      [key]: id,
    },
  };
}