import DeactivateAccountModal from 'components/Account/DeactivateAccountModal';
import React, {
  useCallback,
  useState,
} from 'react';
import AccountContext, { TAB_TYPE_SUBSCRIPTION } from '../AccountContext';

export default function Deletion() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDismissDeactivateAccountModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onSummonDeactivateAccountModal = useCallback(() => setIsModalOpen(true), []);

  return (
    <AccountContext.Consumer>
      {({ setCurrentTab }) => (
        <>
          <p>
            This will permanently deactivate your user account and
            all characters in Fallen London (and all other StoryNexus worlds)
            attached to it.
          </p>
          <p>
            If you're just trying to unsubscribe from Exceptional Friendship,
            {' '}
            <button
              className="button--link"
              type="button"
              onClick={() => setCurrentTab(TAB_TYPE_SUBSCRIPTION)}
            >
              click here
            </button>
            {' '}
            instead.
          </p>
          <button
            type="button"
            className="button button--dangerous button--no-margin"
            onClick={onSummonDeactivateAccountModal}
          >
            Deactivate Account
          </button>
          <DeactivateAccountModal
            isOpen={isModalOpen}
            onRequestClose={onDismissDeactivateAccountModal}
          />
        </>
      )}
    </AccountContext.Consumer>
  );
}