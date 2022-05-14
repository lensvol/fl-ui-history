import { FetchFateResponse } from 'services/FateService';

export default function calculateEffectiveFate({ currentFate, currentNex }: Partial<FetchFateResponse>) {
  return Number(currentFate ?? 0) + Number(currentNex ?? 0);
}