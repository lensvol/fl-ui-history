import React from 'react';
import { connect } from 'react-redux';
import {
  Props as ReactModalProps,
} from 'react-modal';
import Modal from 'components/Modal';
import getCanChangeFaceForFree from 'selectors/myself/getCanChangeFaceForFree';
import { IAppState } from 'types/app';
import PurchaseFace from './PurchaseFace';

export function PurchaseFaceModal(props: Props) {
  const {
    isOpen,
    onRequestClose,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal--avatar-list"
    >
      <PurchaseFace
        onRequestClose={() => onRequestClose()}
      />
    </Modal>
  );
}

type OwnProps = Pick<ReactModalProps, 'isOpen'> & {
  onRequestClose: (_args?: any) => void,
};

const mapStateToProps = (state: IAppState) => ({
  canChangeFaceForFree: getCanChangeFaceForFree(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PurchaseFaceModal);