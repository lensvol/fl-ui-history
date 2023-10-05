import { toggleMapView } from "actions/map";
import { ActionCreator, AnyAction } from "redux";
import * as Constants from "features/content-behaviour-integration/constants";
import { toggleEnhancedStoreView } from "actions/fate";

export const COMMAND_DELIMITER = "$$";

const navigateToExchange: ActionCreator<any> = (history: any) => (_: any) => {
  history.push("/bazaar");
};

// eslint-disable-next-line import/prefer-default-export
export const COMMAND_MAP: { [p: string]: ActionCreator<AnyAction> } = {
  [Constants.UI_BEHAVIOUR_OPEN_MAP]: toggleMapView,
  [Constants.UI_BEHAVIOUR_OPEN_BAZAAR]: navigateToExchange,
  [Constants.UI_BEHAVIOUR_OPEN_STORY_MENU]: toggleEnhancedStoreView,
};
