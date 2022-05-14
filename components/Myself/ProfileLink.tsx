/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';


export function ProfileLink({ name }: Props) {
  return (
    <a
      href={`/profile/${name}`}
      target="_blank"
      className="button button--primary button--no-margin"
      rel="opener"
    >
      View profile
    </a>
  );
}

const mapStateToProps = ({ myself: { character: { name } } }: IAppState) => ({ name });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ProfileLink);