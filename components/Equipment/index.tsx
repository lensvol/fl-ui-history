import UseOrEquipModal from 'components/Possessions/UseOrEquipModal';
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';

import {
  equipQuality,
  renameOutfit,
  unequipQuality,
} from 'actions/outfit';
import { useQuality as _useQuality } from 'actions/storylet';

import findSelectedOutfit from 'selectors/outfits/findSelectedOutfit';
import EquipmentGroup from 'components/Equipment/EquipmentGroup';
import RenameOutfitModal from 'components/Possessions/RenameOutfitModal';
import {
  Success,
} from 'services/BaseMonadicService';
import { IAppState } from 'types/app';
import { OutfitSlotName } from 'types/outfit';
import { Feature } from 'flagged';
import EquipmentContext from 'components/Equipment/EquipmentContext';
import OutfitControls from 'components/Equipment/OutfitControls';
import { OUTFIT_CATEGORIES } from 'constants/outfits';
import {
  FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS,
  NEW_OUTFIT_BEHAVIOUR,
} from 'features/feature-flags';
import { IQuality } from 'types/qualities';
import PossessionsContext from 'components/Possessions/PossessionsContext';
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

export function Equipment({
  history,
  outfit,
}: Props) {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [filterString, setFilterString] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isUseOrEquipModalOpen, setIsUseOrEquipModalOpen] = useState(false);
  const [qualityBeingUsedOrEquipped, setQualityBeingUsedOrEquipped] = useState<{
    quality: Pick<IQuality, 'name' | 'image' | 'id'>,
    equipped: boolean
  } | undefined>();

  const groups = useMemo(() => (OUTFIT_CATEGORIES.map(name => ({ name }))), []);

  const handleEquipQuality = useCallback(() => {
    setIsUseOrEquipModalOpen(false);
    if (qualityBeingUsedOrEquipped) {
      const { equipped, quality: { id } } = qualityBeingUsedOrEquipped;
      if (equipped) {
        dispatch(unequipQuality(id));
      } else {
        dispatch(equipQuality(id));
      }
    }
  }, [
    dispatch,
    qualityBeingUsedOrEquipped,
  ]);

  const handleFilter = useCallback((newFilterString: string) => {
    setFilterString(newFilterString);
  }, []);

  const handleUseQuality = useCallback(() => {
    setIsUseOrEquipModalOpen(false);
    if (qualityBeingUsedOrEquipped) {
      dispatch(_useQuality(qualityBeingUsedOrEquipped.quality.id, history));
    }
  }, [
    dispatch,
    history,
    qualityBeingUsedOrEquipped,
  ]);

  const handleRequestCloseUseOrEquipModal = useCallback(() => {
    setIsUseOrEquipModalOpen(false);
    setQualityBeingUsedOrEquipped(undefined);
  }, []);

  const openUseOrEquipModal = useCallback((
    quality: { id: number, name: string, image: string },
    equipped: boolean,
  ) => {
    setIsUseOrEquipModalOpen(true);
    setQualityBeingUsedOrEquipped({ quality, equipped });
  }, []);

  const onSubmit = useCallback(async ({ name }: { name: string }) => {
    setErrorMessage(undefined);

    if (!outfit) {
      return;
    }

    try {
      const result = await renameOutfit(outfit.id, name)(dispatch);
      if (result instanceof Success) {
        setIsRenameModalOpen(false);
        return;
      }
      setErrorMessage(result.message);
    } catch (e) {
      // Possibly a bad request
      console.error(e);
    }
  }, [
    dispatch,
    outfit,
  ]);

  return (
    <PossessionsContext.Consumer>
      {({ currentlyInStorylet }) => (
        <EquipmentContext.Provider
          value={{
            filterString,
            openUseOrEquipModal,
            onFilter: handleFilter,
            controlIds: {
              equipmentSearchId: 'a11y-equipment-search',
              outfitDropdownId: 'a11y-outfit-dropdown',
            },
          }}
        >
          <Feature name={NEW_OUTFIT_BEHAVIOUR}>
            {(areOutfitsLockable: boolean) => (
              <>
                <Feature name={FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS}>
                  {(doesStoryletStateLockOutfits: boolean) => (
                    <OutfitControls
                      areOutfitsLockable={areOutfitsLockable}
                      doesStoryletStateLockOutfits={doesStoryletStateLockOutfits}
                    />
                  )}
                </Feature>
                <ul className="equipment-group-list">
                  {groups.map(({ name }: { name: OutfitSlotName }) => (
                    <li
                      className="equipment-group-list__item"
                      key={name}
                    >
                      <Feature name={FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS}>
                        {(doesStoryletStateLockOutfits: boolean) => (
                          <EquipmentGroup
                            areOutfitsLockable={areOutfitsLockable}
                            doesStoryletStateLockOutfits={doesStoryletStateLockOutfits}
                            filterString={filterString}
                            key={name}
                            name={name}
                          />
                        )}
                      </Feature>
                    </li>
                  ))}
                </ul>
                <RenameOutfitModal
                  errorMessage={errorMessage}
                  isOpen={isRenameModalOpen}
                  onRequestClose={() => setIsRenameModalOpen(false)}
                  onSubmit={onSubmit}
                />
              </>
            )}
          </Feature>
          {qualityBeingUsedOrEquipped && (
            <UseOrEquipModal
              currentlyInStorylet={currentlyInStorylet}
              isOpen={isUseOrEquipModalOpen}
              onEquip={handleEquipQuality}
              onUse={handleUseQuality}
              onRequestClose={handleRequestCloseUseOrEquipModal}
              quality={qualityBeingUsedOrEquipped.quality}
              equipped={qualityBeingUsedOrEquipped.equipped}
            />
          )}
        </EquipmentContext.Provider>
      )}
    </PossessionsContext.Consumer>
  );
}

Equipment.displayName = 'Equipment';

const mapStateToProps = (state: IAppState) => ({
  outfit: findSelectedOutfit(state),
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;


export default withRouter(connect(mapStateToProps)(Equipment));
