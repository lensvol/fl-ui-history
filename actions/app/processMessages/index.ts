import processFateChange from "actions/app/processFateChange";
import findEquipmentChangeMessage from "actions/app/processMessages/findEquipmentChangeMessage";
import { AREA_CHANGE_MESSAGE } from "constants/message-types";

import { fetchActions } from "actions/actions";
import { fetch as fetchFate } from "actions/fate";
import { fetchMyself } from "actions/myself";
import { fetch as fetchMap } from "actions/map";
import { fetchOutfit } from "actions/outfit";
import { fetchPlans } from "actions/plans";
import { shouldFetch as setOpportunitiesShouldFetch } from "actions/cards";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import {
  ApiResultMessageQualityEffect,
  IMessages,
  IMessagesObject,
  ISettingChangeMessage,
} from "types/app/messages";

import getQualitiesRequiredAllPlans from "selectors/plans/getQualitiesRequiredAllPlans";
import getQualityRequirementsAllCards from "selectors/cards/getQualitiesRequiredAllCards";

import buildMessagesObject from "./buildMessagesObject";
import findAndProcessAreaMessage from "./findAndProcessAreaMessage";
import findAndProcessOutfitChangeabilityMessage from "./findAndProcessOutfitChangeabilityMessage";
import findChangesToAutomaticallyEquippedItems from "./findChangesToAutomaticallyEquippedItems";
import findChangesToMapState from "./findChangesToMapState";
import findEquippedItemLosses from "./findEquippedItemLosses";
import findNewEquippableItems from "./findNewEquippableItems";
import findSettingChangeMessages from "./findSettingChangeMessages";
import shouldFetchOpportunityCards from "./shouldFetchOpportunityCards";
import processEquippedItemLosses from "./processEquippedItemLosses";
import processStandardMessages from "./processStandardMessages";
import processSettingChangeMessage from "./processSettingChangeMessage";
import shouldPlansUpdate from "./shouldPlansUpdate";
import findQualityCapChanges from "./findQualityCapChanges";

export default function processMessages(
  messages: IMessages,
  ignoredMessageTypes: string[] = []
) {
  if (Array.isArray(messages)) {
    return processMessageArray(messages, ignoredMessageTypes);
  }
  return processMessagesObject(messages, ignoredMessageTypes);
}

function processMessageArray(
  messages: ApiResultMessageQualityEffect[],
  ignoredMessageTypes: string[] = []
) {
  const obj = buildMessagesObject(messages);
  return processMessagesObject(obj, ignoredMessageTypes);
}

function processMessagesObject(
  messages: IMessagesObject,
  ignoredMessageTypes: string[] = []
) {
  return (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState
  ) => {
    try {
      let isFateRefreshNeeded = false;

      const { fateMessage } = messages;

      const defaultMessages = (messages.defaultMessages ?? []).filter(
        (m) => ignoredMessageTypes.indexOf(m.type) < 0
      );
      const standardMessages = (messages.standardMessages ?? []).filter(
        (m) => ignoredMessageTypes.indexOf(m.type) < 0
      );

      // Handle Fate changes
      if (fateMessage) {
        // Whether or not we can determine the amount of Fate spent, we will need to do a complete
        // Fate refresh, because it's possible that we have just bought an Exceptional Story from
        // a branch.
        isFateRefreshNeeded = true;

        // If we have a currencyChangeAmount, then process it now
        if (fateMessage.currencyChangeAmount) {
          dispatch(processFateChange(fateMessage.currencyChangeAmount));
        }
      }

      // If outfit changeability has changed, process that too
      dispatch(findAndProcessOutfitChangeabilityMessage(defaultMessages));

      // Find messages granting an outfit
      const wasNewOutfitGranted = messages.outfitGrantedMessage !== undefined;

      // Process Setting change(s), if we find any.
      // This will also potentially wipe the map sprite cache and trigger a map fetch.
      // Pretty complex stuff.
      const settingChangeMessages = findSettingChangeMessages(
        defaultMessages,
        ignoredMessageTypes
      );
      if (settingChangeMessages.length > 0) {
        settingChangeMessages.forEach((message) => {
          dispatch(
            processSettingChangeMessage(message as ISettingChangeMessage)
          );
        });
      }

      // Find other changes to map state
      const changesToMapState = findChangesToMapState(
        [...defaultMessages, ...standardMessages],
        getState(),
        ignoredMessageTypes
      );

      // Process any area change messages we encounter
      if (!ignoredMessageTypes.includes(AREA_CHANGE_MESSAGE)) {
        dispatch(findAndProcessAreaMessage(messages));
      }

      // Is the character losing any equipped items?
      const equippedItemLosses = findEquippedItemLosses(
        defaultMessages,
        getState(),
        ignoredMessageTypes
      );

      // Have any of the character's quality caps changed?
      const qualityCapChanges = findQualityCapChanges(defaultMessages);

      // Have we acquired any equippable items that we previously had none of?
      const newEquippableItems = findNewEquippableItems(
        defaultMessages,
        getState()
      );

      // Did slots like Destiny, Spouse, etc. get changed?
      const changesToAutomaticallyEquippedItems =
        findChangesToAutomaticallyEquippedItems(
          defaultMessages,
          getState(),
          ignoredMessageTypes
        );

      // Dispatch a slot-became-empty action for each newly-empty slot
      dispatch(processEquippedItemLosses(equippedItemLosses));

      // Set a flag on the opportunity cards reducer: we are not fetching opportunity cards now,
      // but they need fetching soon (e.g. when the player is out of the End phase)
      if (
        shouldFetchOpportunityCards(
          defaultMessages,
          getQualityRequirementsAllCards(getState().cards.displayCards),
          messages.deckRefreshedMessage
        )
      ) {
        dispatch(setOpportunitiesShouldFetch());
      }

      // Update qualities that have changed
      dispatch(processStandardMessages(standardMessages));

      /* Finally, kick off any required fetches */

      // If anything interesting has happened, we'll need to re-fetch our stuff
      const isFetchMyselfNeeded =
        wasNewOutfitGranted ||
        [
          changesToAutomaticallyEquippedItems,
          equippedItemLosses,
          newEquippableItems,
          qualityCapChanges,
        ].some((l) => l.length > 0);

      if (isFetchMyselfNeeded && !getState().myself.isFetching) {
        dispatch(fetchMyself());
      }

      // If we need to fetch new map data, then do so now
      const isFetchMapNeeded = changesToMapState.length > 0;
      if (isFetchMapNeeded && !getState().map.isFetching) {
        dispatch(fetchMap());
      }

      // If we need to fetch outfits again, then do so now
      const isFetchOutfitNeeded =
        findEquipmentChangeMessage(defaultMessages) !== undefined ||
        changesToAutomaticallyEquippedItems.length > 0;
      if (isFetchOutfitNeeded) {
        dispatch(fetchOutfit());
      }

      // If we need to fetch updated plans, then do so now
      const isFetchPlansNeeded = shouldPlansUpdate(
        defaultMessages,
        getQualitiesRequiredAllPlans(getState().plans)
      );
      if (isFetchPlansNeeded && !getState().plans.isFetching) {
        dispatch(fetchPlans());
      }

      // If we need to refresh Fate, then do so now
      if (isFateRefreshNeeded) {
        dispatch(fetchFate());
        dispatch(fetchActions());
      }
    } catch (error) {
      console.error(error);
    }
  };
}
