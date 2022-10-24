export const ACTIONS_REFRESHED_MESSAGE = "ActionsRefreshedMessage";
export const AREA_CHANGE_MESSAGE = "AreaChangeMessage";
export const DECK_REFRESHED_MESSAGE = "DeckRefreshedMessage";
export const DIFFICULTY_ROLL_FAILURE_MESSAGE = "DifficultyRollFailureMessage";
export const DIFFICULTY_ROLL_SUCCESS_MESSAGE = "DifficultyRollSuccessMessage";
export const MAP_SHOULD_UPDATE_MESSAGE = "MapShouldUpdateMessage";
export const FATE_BRANCH_CURRENCY_USED_MESSAGE =
  "FateBranchCurrencyUsedMessage";
export const FATE_POINT_CHANGE_MESSAGE = "FatePointChangeMessage";
export const OUTFIT_GRANTED_MESSAGE = "OutfitGrantedMessage";
export const PLAN_COMPLETED_MESSAGE = "PlanCompletedMessage";
export const QUALITY_EXPLICITLY_SET_MESSAGE = "QualityExplicitlySetMessage";
export const SETTING_CHANGE_MESSAGE = "SettingChangeMessage";
export const STANDARD_QUALITY_CHANGE_MESSAGE = "StandardQualityChangeMessage";
export const STORE_ITEM_CURRENCY_USED_MESSAGE =
  "STORE_ITEM_CURRENCY_USED_MESSAGE";

/*
The server-side message type hierarchy, courtesy of Henry

QualityChangeMessage
  QualityExplicitlySetMessage
  PyramidQualityChangeMessage
  StandardQualityChangeMessage
  RelationshipQualityChangeMessage
DifficultyResultMessage
  DifficultyRollFailureMessage
  DifficultyRollSuccessMessage
SecondChanceResultMessage

CurrencyUsedMessage
  StoreItemCurrencyUsedMessage
  FateBranchCurrencyUsedMessage
ActionsRefreshedMessage
AreaChangeMessage
AvatarChangeMessage
FatePointChangeMessage
InfoMessage(general purpose message)
LivingStoryStartedMessage
OutfitChangeabilityMessage
PlanCompletedMessage
QualityCapMessage
SettingChangeMessage
 */
