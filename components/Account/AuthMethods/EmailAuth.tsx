import React, {
  useCallback,
  useState,
} from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';
import LinkEmailModal from './LinkEmailModal';
import UpdateEmailModal from './UpdateEmailModal';

export function EmailAuth(props: Props) {
  const {
    buttonClassName,
    data: { emailAuth, emailAddress },
  } = props;

  const [isLinkEmailModalOpen, setIsLinkEmailModalOpen] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);

  const handleCloseLinkEmailModal = useCallback(() => setIsLinkEmailModalOpen(false), []);
  const handleCloseUpdateEmailModal = useCallback(() => setIsUpdateEmailModalOpen(false), []);
  const onClickToLink = useCallback(() => setIsLinkEmailModalOpen(true), []);
  const onClickToUpdate = useCallback(() => setIsUpdateEmailModalOpen(true), []);

  const buttonLabel = emailAuth ? emailAddress : 'Link your email account';
  const onClick = emailAuth ? onClickToUpdate : onClickToLink;
  return (
    <>
      <i className="fa fa-fw fa-envelope" />
      {' '}
      <button
        type="button"
        className={classnames('button--link', buttonClassName)}
        onClick={onClick}
      >
        {buttonLabel}
      </button>

      <LinkEmailModal
        isOpen={isLinkEmailModalOpen}
        onRequestClose={handleCloseLinkEmailModal}
      />

      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        onRequestClose={handleCloseUpdateEmailModal}
      />
    </>
  );
}

const mapStateToProps = (state: IAppState) => ({ data: state.settings.data });

type OwnProps = {
  buttonClassName?: string,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(EmailAuth);