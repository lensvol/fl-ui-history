import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

type OwnProps = {
  onClick: () => void,
  undiscardable?: boolean,
};

const mapStateToProps = ({ cards: { isFetching } }: IAppState) => ({ isFetching });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export function DiscardButton({ isFetching, onClick, undiscardable }: Props) {
  if (undiscardable) {
    return null;
  }

  return (
    <button
      className="button button--primary button--small card__discard-button"
      disabled={isFetching}
      onClick={onClick}
      type="button"
    >
      Discard
    </button>
  );
}

DiscardButton.displayName = 'DiscardButton';

export default connect(mapStateToProps)(DiscardButton);