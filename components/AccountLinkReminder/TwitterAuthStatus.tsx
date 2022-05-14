import TwitterAuth from 'components/Account/AuthMethods/TwitterAuth';
import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

export function TwitterAuthStatus({
  authMethods,
}: Props) {
  const twitterAuthMethod = useMemo(() => authMethods?.find(method => method.type === 'Twitter'), [authMethods]);
  if (twitterAuthMethod) {
    return (
      <>
        <i className="fa fa-check" />
        {' '}
        Linked to
        {' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="link--inverse"
          href={twitterAuthMethod.profileUrl}
        >
          @
          {twitterAuthMethod.displayName}
        </a>
        .
      </>
    );
  }
  return (
    <>
      <TwitterAuth
        buttonClassName="button--link-inverse"
      />
    </>
  );
}

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(TwitterAuthStatus);
