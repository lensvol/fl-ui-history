import moment from "moment";
import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IFateState } from "reducers/fate";

const getFate = ({ fate }: IAppState) => fate;

const output = (fate: IFateState) => {
  const premiumSubExpiry = new Date(fate.premiumSubExpiryDateTime);
  const now = new Date();
  return moment(premiumSubExpiry).diff(moment(now), "days");
};

export default createSelector([getFate], output);
