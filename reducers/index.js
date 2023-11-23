import { combineReducers } from "redux";

import timeTheHealer from "features/timeTheHealer/timeTheHealerSlice";
import { reducer as contacts } from "features/contacts";
import { reducer as profile } from "features/profile";

import accountLinkReminder from "./accountLinkReminder";
import actions from "./actions";
import app from "./app";
import branches from "./branches";
import categories from "./categories";
import user from "./user";
import storylet from "./storylet";
import cards from "./cards";
import equipment from "./equipment";
import messages from "./messages";
import myself from "./myself";
import exchange from "./exchange";
import fate from "./fate";
import mapAdmin from "./mapAdmin";
import plans from "./plans";
import registration from "./registration";
import map from "./map";
import modalTooltip from "./modalTooltip";
import mysteries from "./mysteries";
import outfit from "./outfit";
import phase from "./phase";
import timer from "./timer";
import scrollToComponent from "./scrollToComponent";
import spriteLoader from "./spriteLoader";
import subscription from "./subscription";
import payment from "./payment";
import screen from "./screen";
import settings from "./settings";
import sidebar from "./sidebar";
import socialAct from "./socialAct";
import subtabs from "./subtabs";
import news from "./news";
import infoBar from "./infoBar";
import accessCodes from "./accessCodes";
import versionSync from "./versionSync";

/**
 * Application reducer
 *
 * Combine all the reducers so the application can access them
 *
 * @type {Function}
 */
const appReducer = combineReducers({
  accountLinkReminder,
  actions,
  app,
  branches,
  cards,
  myself,
  categories,
  contacts,
  equipment,
  exchange,
  fate,
  map,
  mapAdmin,
  messages,
  modalTooltip,
  mysteries,
  outfit,
  payment,
  phase,
  plans,
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
  timeTheHealer,
  timer,
  user,
  news,
  infoBar,
  accessCodes,
  profile,
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
