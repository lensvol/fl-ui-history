import EmailAuth from 'components/Account/AuthMethods/EmailAuth';
import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

export function EmailAuthStatus({
  authMethods,
}: Props) {
  const emailAuthMethod = useMemo(() => authMethods?.find(method => method.type === 'Email'), [authMethods]);

  if (emailAuthMethod) {
    return (
      <>
        <i className="fa fa-check" />
        {' '}
        Linked to
        {' '}
        <strong>
          {emailAuthMethod.email}
        </strong>
        .
      </>
    );
  }

  return (
    <EmailAuth buttonClassName="button--link-inverse" />
  );
}

const mapStateToProps = ({
  settings: {
    authMethods,
  },
}: IAppState) => ({ authMethods });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(EmailAuthStatus);