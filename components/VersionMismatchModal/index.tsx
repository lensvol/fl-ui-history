import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";

import * as phases from "constants/phases";
import { dismissVersionMismatchModal } from "actions/versionSync";
import { IAppState } from "types/app";

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function;
};

export function VersionMismatchModal({
  dispatch,
  isClientOutdated,
  isModalDismissed,
  phase,
}: Props) {
  const isOpen = useMemo(() => {
    return isClientOutdated && !isModalDismissed && !(phase === phases.END);
  }, [isClientOutdated, isModalDismissed, phase]);

  const onRequestClose = useCallback(() => {
    dispatch(dismissVersionMismatchModal());
  }, [dispatch]);

  return (
    <ReactModal
      className="modal--tooltip-like__content"
      overlayClassName="modal--tooltip-like__overlay modal__overlay--has-visible-backdrop"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <h1
        className="heading heading--3"
        style={{
          marginBottom: ".5rem",
          textAlign: "center",
        }}
      >
        Fallen London has updated!
      </h1>
      <p>Please refresh the page to continue.</p>
      <div className="buttons">
        <button
          className="button button--primary"
          onClick={() => window.location.reload(true)}
        >
          Refresh
        </button>
      </div>
    </ReactModal>
  );
}

const mapStateToProps = ({
  storylet: { phase },
  versionSync: { isClientOutdated, isModalDismissed },
}: IAppState) => ({
  isClientOutdated,
  isModalDismissed,
  phase,
});

export default connect(mapStateToProps)(VersionMismatchModal);
