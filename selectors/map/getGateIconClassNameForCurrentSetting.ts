import classnames from 'classnames';
import {
  isUnterzeePlanningSetting,
  isUnterzeeSetting,
} from 'features/mapping';
import { createSelector } from 'reselect';
import { IAppState } from 'types/app';

interface Props {
  selected?: boolean,
}

const getCurrentSetting = (state: IAppState) => state.map.setting;

const getIsSelected = (_state: IAppState, props: Props) => props.selected;

const outputFn = (
  setting: ReturnType<typeof getCurrentSetting>,
  selected: ReturnType<typeof getIsSelected>,
) => classnames(
  'interactive-marker__gate-icon',
  selected && 'interactive-marker__gate-icon--selected',
  (isUnterzeePlanningSetting(setting) || isUnterzeeSetting(setting)) && 'interactive-marker__gate-icon--unterzee',
);

export default createSelector(getCurrentSetting, getIsSelected, outputFn);