import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Image from 'components/Image';
import Loading from 'components/Loading';

import { Props } from './index';

export function ConfirmModalReady({
  avatar,
  fateCost,
  isSubmitting,
  isFree,
  onConfirm,
}: Props & {
  fateCost: number,
  isSubmitting: boolean,
  onConfirm: (_args?: any) => void,
}) {
  const buttonLabel = useMemo(() => {
    if (isSubmitting) {
      return (
        <Loading
          spinner
          small
        />
      );
    }

    if (isFree) {
      return <span>Change</span>;
    }

    return (
      <span>
        Change (
        {fateCost}
        {' '}
        Fate)
      </span>
    );
  }, [
    fateCost,
    isFree,
    isSubmitting,
  ]);

  return (
    <div>
      <h3
        className="heading heading--2"
      >
        Change your face?
      </h3>
      <hr />
      <div className="media dialog__media">
        <div className="media__content">
          <div className="media__left">
            <div>
              <Image
                className="media__object"
                icon={avatar}
                alt={avatar}
                width={78}
                height={100}
                type="cameo"
              />
            </div>
          </div>
          <div className="media__body">
            <p>Are you sure?</p>
            {isFree ? (
              <p className="descriptive">Changing your face is free, just this once.</p>
            ) : (
              <p className="descriptive">
                This will immediately deduct
                {' '}
                {fateCost}
                {' '}
                Fate.
              </p>
            )}
          </div>
          <hr />
        </div>
        <div className="dialog__actions">
          <button
            className={classnames(
              'button',
              isFree ? 'button--primary' : 'button--secondary',
            )}
            onClick={onConfirm}
            type="button"
            disabled={isSubmitting}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default connect()(ConfirmModalReady);