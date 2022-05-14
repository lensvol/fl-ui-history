import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import Dialog from 'components/Dialog';
import PurchaseFate from 'components/Payment/components/PurchaseFate';
import { IAppState } from 'types/app';

interface Props {
  disableTouchEvents?: boolean,
  isModalOpen: boolean,
  isSuccess: boolean,
  onRequestClose: () => void,
  style?: {
    overlay?: CSSProperties,
    content?: CSSProperties,
  },
}

export function PurchaseFateFromGateEvent(props: Props) {
  return (
    <Dialog
      disableTouchEvents={props.disableTouchEvents}
      large={!props.isSuccess}
      isOpen={props.isModalOpen}
      onRequestClose={props.onRequestClose}
      style={props.style}
    >
      <PurchaseFate />
    </Dialog>
  );
}

const mapStateToProps = ({ payment: { isSuccess } }: IAppState) => ({ isSuccess });

export default connect(mapStateToProps)(PurchaseFateFromGateEvent);
