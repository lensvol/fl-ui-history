import { OUTFIT_TYPE_EXCEPTIONAL } from 'constants/outfits';
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { NEW_OUTFIT_BEHAVIOUR } from 'features/feature-flags';
import { useFeature } from 'flagged';
import Select from 'react-select';
import getOrderedOutfits from 'selectors/outfit/getOrderedOutfits';
import getCanUserChangeOutfit from 'selectors/possessions/getCanUserChangeOutfit';
import { IAppState } from 'types/app';

import { useSelectedOutfit } from './hooks';
import { compareOutfits } from './util';
import * as DropdownStyles from './dropdown-styles';
import EquipmentContext from './EquipmentContext';

type DropdownOption = {
  label: string,
  type: string,
  value: number | string,
  isDisabled: boolean,
};

export function OutfitDropdown({
  isChanging,
  isExceptionalFriend,
  maxOutfits,
  onChange,
  outfits,
}: Props) {
  const selectedOutfit = useSelectedOutfit(outfits);

  const handleBlurOrChangeFromNativeSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    // If nothing has changed, don't fire the onChange handler
    if (selectedOutfit?.id.toString() === e.target.value) {
      return;
    }
    onChange(e.target.value);
  }, [
    onChange,
    selectedOutfit,
  ]);

  const handleChange = useCallback((arg: any) => {
    const { value } = arg as { label: string, value: number | string };
    onChange(value);
  }, [
    onChange,
  ]);

  const hasNewOutfitBehaviour = useFeature(NEW_OUTFIT_BEHAVIOUR);

  const choices = useMemo(() => {
    const sortedOutfits = [...outfits]
      .sort(compareOutfits);

    const purchasedOutfits = outfits.filter(a => a.type === 'Purchased');

    // We can't buy any more outfits; just return what the player has
    if (purchasedOutfits.length >= maxOutfits) {
      return sortedOutfits;
    }

    // We shouldn't offer the option to buy more; just return what the player has
    if (!hasNewOutfitBehaviour) {
      return sortedOutfits;
    }

    // Return what the player has plus the option to purchase
    return [
      ...sortedOutfits,
      {
        id: 'buy-new-outfit',
        name: 'Unlock another outfit...',
        type: 'BuyOutfit',
      },
    ];
  }, [
    hasNewOutfitBehaviour,
    maxOutfits,
    outfits,
  ]);

  const options = useMemo(
    () => [...choices]
      .filter(c => c.id !== selectedOutfit.id)
      .map(c => ({
        label: c.name,
        type: c.type,
        value: c.id,
        isDisabled: c.type === OUTFIT_TYPE_EXCEPTIONAL && !isExceptionalFriend,
      }))
      .sort((a, b) => {
        if (a.isDisabled === b.isDisabled) {
          return 0;
        }
        if (a.isDisabled) {
          return 1;
        }
        return -1;
      }),
    [
      choices,
      isExceptionalFriend,
      selectedOutfit.id,
    ],
  );

  return (
    <>
      <EquipmentContext.Consumer>
        {({ controlIds: { outfitDropdownId } }) => (
          <select
            className="u-visually-hidden outfit-controls__accessible-select"
            value={selectedOutfit.id}
            onBlur={handleBlurOrChangeFromNativeSelect}
            onChange={handleBlurOrChangeFromNativeSelect}
            id={outfitDropdownId}
            tabIndex={0}
          >
            {choices.map(choice => (
              <option
                key={choice.id}
                value={choice.id}
              >
                {`${choice.name} (${choice.type})`}
              </option>
            ))}
          </select>
        )}
      </EquipmentContext.Consumer>
      <div
        aria-hidden="true"
        style={{
          alignItems: 'baseline',
          display: 'flex',
          flex: 1,
        }}
      >
        <Select
          aria-hidden="true"
          onChange={handleChange}
          value={{
            label: selectedOutfit.name,
            value: selectedOutfit.id,
            type: selectedOutfit.type,
            isDisabled: false,
          }}
          options={options}
          isClearable={false}
          isDisabled={isChanging}
          isSearchable={false}
          theme={DropdownStyles.theme}
          styles={DropdownStyles.styles}
          components={{
            IndicatorSeparator: () => null,
          }}
        />
        <span
          className="heading heading--3"
          style={{
            position: 'relative',
            top: '2px',
          }}
        >
          Outfit
        </span>
      </div>
    </>
  );
}

type OwnProps = {
  areOutfitsLockable: boolean,
  doesStoryletStateLockOutfits: boolean,
  onChange: (id: string | number) => void,
};

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  canChangeOutfit: getCanUserChangeOutfit(state, props),
  isChanging: state.outfit.isChanging,
  isExceptionalFriend: state.fate.isExceptionalFriend,
  maxOutfits: state.outfit.maxOutfits,
  outfits: getOrderedOutfits(state),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export default connect(mapStateToProps)(OutfitDropdown);
