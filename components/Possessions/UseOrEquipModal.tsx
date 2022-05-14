import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactModal from 'react-modal';
import { IAppState } from 'types/app';
import { IQuality } from 'types/qualities';
import getImagePath from 'utils/getImagePath';

const UseOrEquipModal: React.FC<Props> = ({
  currentlyInStorylet,
  equipped,
  isOpen,
  onEquip,
  onRequestClose,
  onUse,
  quality,
  setting,
}) => {
  const isItemUseAvailable = (setting?.itemsUsableHere) && !currentlyInStorylet;

  const label = useMemo(() => {
    if (equipped) {
      return 'Unequip';
    }
    return 'Equip';
  }, [equipped]);

  const rubric = useMemo(() => {
    if (equipped) {
      return 'This item may be used or unequipped.';
    }
    return 'This item may be used or equipped.';
  }, [equipped]);

  return (
    <ReactModal
      isOpen={isOpen}
      className={classnames(
        'modal--tooltip-like__content',
        'modal--access-code-challenge',
      )}
      overlayClassName={classnames(
        'modal--tooltip-like__overlay',
        'modal__overlay--has-visible-backdrop',
        'modal__overlay--has-transition',
      )}
      onRequestClose={onRequestClose}
    >
      <div className="tooltip--item-modal">
        <div className="icon icon--circular tooltip__icon">
          {/* image */}
          <img
            alt={quality.name}
            src={getImagePath({ icon: quality.image, type: 'small-icon' })}
          />
        </div>
        <div className="tooltip__desc">
          <p className="item__name">
            {quality.name}
          </p>
          <p>
            {rubric}
          </p>
          <div className="tooltip__buttons">
            <button
              className="button button--primary button--sm button--tooltip"
              disabled={!isItemUseAvailable}
              onClick={onUse}
            >
              Use
            </button>
            <button
              className="button button--primary button--sm button--tooltip"
              onClick={onEquip}
            >
              {label}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

type OwnProps = {
  currentlyInStorylet: boolean,
  equipped?: boolean,
  isOpen: boolean,
  onEquip: () => void,
  onRequestClose: () => void,
  onUse: () => void,
  quality: Pick<IQuality, 'image' | 'name'>
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const mapStateToProps = (state: IAppState) => ({
  setting: state.map.setting,
});

export default connect(mapStateToProps)(UseOrEquipModal);