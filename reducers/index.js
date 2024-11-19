import { combineReducers } from "redux";

import { reducer as contacts } from "features/contacts";
import { reducer as profile } from "features/profile";
import timeTheHealer from "features/timeTheHealer/timeTheHealerSlice";

import accessCodes from "reducers/accessCodes";
import accountLinkReminder from "reducers/accountLinkReminder";
import actions from "reducers/actions";
import app from "reducers/app";
import branches from "reducers/branches";
import cards from "reducers/cards";
import equipment from "reducers/equipment";
import exchange from "reducers/exchange";
import fate from "reducers/fate";
import infoBar from "reducers/infoBar";
import map from "reducers/map";
import mapAdmin from "reducers/mapAdmin";
import messages from "reducers/messages";
import modalTooltip from "reducers/modalTooltip";
import myself from "reducers/myself";
import mysteries from "reducers/mysteries";
import news from "reducers/news";
import outfit from "reducers/outfit";
import payment from "reducers/payment";
import phase from "reducers/phase";
import plans from "reducers/plans";
import registration from "reducers/registration";
import screen from "reducers/screen";
import scrollToComponent from "reducers/scrollToComponent";
import settings from "reducers/settings";
import sidebar from "reducers/sidebar";
import socialAct from "reducers/socialAct";
import spriteLoader from "reducers/spriteLoader";
import storylet from "reducers/storylet";
import subscription from "reducers/subscription";
import subtabs from "reducers/subtabs";
import timer from "reducers/timer";
import user from "reducers/user";
import versionSync from "reducers/versionSync";

/**
 * Application reducer
 *
 * Combine all the reducers so the application can access them
 *
 * @type {Function}
 */
const appReducer = combineReducers({
  accessCodes,
  accountLinkReminder,
  actions,
  app,
  branches,
  cards,
  contacts,
  equipment,
  exchange,
  fate,
  infoBar,
  map,
  mapAdmin,
  messages,
  modalTooltip,
  myself,
  mysteries,
  news,
  outfit,
  payment,
  phase,
  plans,
  profile,
  registration,
  screen,
  scrollToComponent,
  settings,
  sidebar,
  socialAct,
  spriteLoader,
  storylet,
  subscription,
  subtabs,
  timer,
  timeTheHealer,
  user,
  versionSync,
});

const rootReducer = (state, action) => {
  if (
    action.type === "user/LOGOUT_SUCCESS" ||
    action.type === "app/RESET_STORE"
  ) {
    // n.b access codes are a type of login screen so we need to
    // retain the data rather than dispose as per comment above
    return appReducer({ accessCodes: { ...state.accessCodes } }, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
