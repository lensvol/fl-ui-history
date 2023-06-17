import { showAccountLinkReminder } from "actions/accountLinkReminder";

import { fetchActions } from "actions/actions";
import extractImages from "actions/app/extractImages";
// import extractImages from './extractImages';
// import preloadImages from './preloadImages';
import preloadImages from "actions/app/preloadImages";
import { fetch as fetchCards } from "actions/cards";
import fetchCategories from "actions/categories/fetchCategories";
import { fetchExchange } from "actions/exchange";
import { fetch as fetchFate } from "actions/fate";
import { getSupportingData } from "actions/infoBar";
import {
  fetch as fetchMap,
  setCurrentArea,
  setCurrentSetting,
} from "actions/map";
import { fetch as fetchMessages } from "actions/messages";
import { fetchMyself } from "actions/myself";
import { fetch as fetchNews } from "actions/news";
import { fetchOutfit } from "actions/outfit";
import { fetchPlans } from "actions/plans";
import { fetch as fetchSettings } from "actions/settings";
import fetchAuthMethods from "actions/settings/fetchAuthMethods";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";
import { fetchUser, loginSuccess } from "actions/user";
import { Either, Failure, Success } from "services/BaseMonadicService";
import { FetchUserResponse } from "services/UserService";
import { IAppState } from "types/app";
import { IFetchMyselfResponseData } from "types/myself";

import destructureJwt from "utils/destructureJwt";
import getImagePath from "utils/getImagePath";

const FLAG_PREFETCH_NON_MAP_IMAGES = false;

/**
 * Fetch the data we need to get the character's current state from a cold start.
 * This should only really be called when the user logs in, or refreshes (or opens a tab)
 * while holding a valid authentication token.
 */

export interface IBootstrapOptions {
  fetchSpritesNow?: boolean;
  hasMapRootAreaChanged?: boolean;
  onSpriteLoadProgress?: (_?: any) => any;
}

export default function performInitialRequests(options = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return async (dispatch: Function, _getState: () => IAppState) => {
    // Have we got a JWT with a character ID?
    const { characterId } = destructureJwt();
    // If not, then just return.
    if (!characterId) {
      return;
    }

    // Fetch the list of app categories (which may not be available)
    try {
      await dispatch(fetchCategories());
    } catch (error) {
      console.warn("Failed to fetch categories; continuing bootstrap");
    }

    // Fetch myself qualities and optionally prefetch quality images
    const fetchMyselfResult: Success<IFetchMyselfResponseData> | Failure =
      await dispatch(fetchMyself());
    // No need to await images
    if (fetchMyselfResult instanceof Success && FLAG_PREFETCH_NON_MAP_IMAGES) {
      const images = extractImages();
      preloadImages(
        images.map((image) => getImagePath({ icon: image, type: "small-icon" }))
      );
    }

    // Fetch outfit
    dispatch(fetchOutfit());

    // Fetch storylet data too --- we need this even if we're loading the possessions
    // tab (or whatever), because we need to render usable items as blocked if the user
    // is in a storylet
    dispatch(fetchAvailableStorylets());

    // Go fetch opp cards too --- remove this responsibility
    // from the mount methods of card components
    dispatch(fetchCards());

    // Fetch messages
    dispatch(fetchMessages());

    // Fetch plans — we need them in order to check whether a player can add a plan
    dispatch(fetchPlans());

    // Fetch settings
    dispatch(fetchSettings()).then(async () => {
      await dispatch(fetchAuthMethods());
    });

    // Get the user data, which we need for a few things
    {
      const userResult: Either<FetchUserResponse> = await dispatch(fetchUser());
      if (userResult instanceof Success) {
        // Now that we have user data, fetch the other stuff we need to load up
        const { data } = userResult;

        // If we have an area key-value pair, set the current area now
        // (this will change in a future API update)
        if (data.area) {
          dispatch(
            setCurrentArea({ ...data.area, ...(data.area.jsonInfo ?? {}) })
          );
        }

        // If we have a Setting k-v pair, set it now
        if (data.setting) {
          dispatch(setCurrentSetting(data.setting));
        }

        dispatch(loginSuccess(data));

        // Show the user an auth nag if the response says we should
        if (data.shouldDisplayAuthNag) {
          dispatch(showAccountLinkReminder());
        }
      }
    }

    // We may not get any map data from the server --- e.g. when the player is registering a
    // new character --- so we need to account for it
    // Fetch the map. This will also load map sprites, so can take a while
    const mapData = await dispatch(fetchMap(options));
    if (mapData?.currentArea) {
      dispatch(setCurrentArea(mapData.currentArea));
    }

    // Fetch bazaar data and optionally fetch images
    const exchangeData: any = await fetchExchange();
    if (exchangeData?.exchange?.shops && FLAG_PREFETCH_NON_MAP_IMAGES) {
      const {
        exchange: { shops },
      } = exchangeData;
      preloadImages(
        shops
          .map((s: any) => s.image)
          .map(
            (image: any) =>
              `${getImagePath({
                icon: image,
                type: "small-icon",
              })}`
          )
      );
    }

    // Fetch action bank stuff
    dispatch(fetchActions());

    // Fetch news and infobar stuff
    dispatch(fetchNews());
    dispatch(getSupportingData());

    // Fetch fate data
    dispatch(fetchFate());
  };
}
