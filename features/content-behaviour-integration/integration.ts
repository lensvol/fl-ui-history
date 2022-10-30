import { toggleMapView } from "actions/map";
import { ActionCreator, AnyAction } from "redux";
import * as Constants from "features/content-behaviour-integration/constants";

export const COMMAND_DELIMITER = "$$";

// eslint-disable-next-line import/prefer-default-export
export const COMMAND_MAP: { [p: string]: ActionCreator<AnyAction> } = {
  [Constants.UI_BEHAVIOUR_OPEN_MAP]: toggleMapView,
};
