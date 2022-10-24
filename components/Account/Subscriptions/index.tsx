import HasSubscriptionContent from "components/Account/Subscriptions/HasSubscriptionContent";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";

import { IAppState } from "types/app";
import ConfirmationModal from "./ConfirmationModal";

function Subscriptions({ data, isCancelling, subscriptions }: Props) {
  const { hasBraintreeSubscription } = subscriptions;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const onRequestCloseConfirmationModal = useCallback(
    () => setIsConfirmationModalOpen(false),
    []
  );

  const content = useMemo(() => {
    if (hasBraintreeSubscription && data !== undefined) {
      return (
        <HasSubscriptionContent
          data={data}
          isCancelling={isCancelling}
          onClick={() => setIsConfirmationModalOpen(true)}
        />
      );
    }

    return <p>You have no subscriptions.</p>;
  }, [data, hasBraintreeSubscription, isCancelling]);

  return (
    <>
      <div>
        <h2 className="heading heading--2">Subscriptions</h2>
        {content}
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onRequestClose={onRequestCloseConfirmationModal}
      />
    </>
  );
}

const mapStateToProps = ({
  settings: { subscriptions },
  subscription: { data, isCancelling },
}: IAppState) => ({ data, isCancelling, subscriptions });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Subscriptions);
