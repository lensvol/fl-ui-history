import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

export function CompleteMessage({ name }: Props) {
  return (
    <div>
      Success! Your username is now '
      {name}
'.
    </div>
  );
}

const mapStateToProps = ({ settings: { data: { name } } }: IAppState) => ({ name });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(CompleteMessage);