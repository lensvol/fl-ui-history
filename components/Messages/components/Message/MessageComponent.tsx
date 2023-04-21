import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";

import Buttonlet from "components/Buttonlet";
import Image from "components/Image";
import { IAppState } from "types/app";

export function MessageComponent({
  children,
  data,
  deletable,
  onDelete,
  emailable,
  onEmail,
  hasMessagingEmail,
  isRequesting,
}: Props) {
  const { ago, description, image, title } = data;

  const isMounted = useIsMounted();

  const [isWorking, setIsWorking] = useState(false);

  const handleClickDelete = useCallback(async () => {
    setIsWorking(true);
    if (onDelete) {
      await onDelete();
    }
    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [onDelete, isMounted]);

  const handleClickEmail = useCallback(async () => {
    setIsWorking(true);

    if (onEmail) {
      await onEmail(hasMessagingEmail);
    }

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [onEmail, hasMessagingEmail, isMounted]);

  const emailToolTip = hasMessagingEmail
    ? "Email a copy of this message to yourself."
    : "Your account must have an email address associated with it to send this message to yourself.";
  const emailClassNames = hasMessagingEmail
    ? undefined
    : { buttonletClassName: "buttonlet-disabled" };

  return (
    <div className="media--message">
      <div className="media__left message__left">
        <span className="message__image">
          <Image
            className="media__object"
            icon={image}
            alt="A Message"
            width={40}
            height={52}
            defaultCursor
            type="icon"
          />
        </span>
      </div>
      <div className="media__body message__body">
        {deletable && (
          <div className="message__delete-button-container">
            {deletable && (
              <Buttonlet
                type="close"
                onClick={handleClickDelete}
                disabled={isWorking || isRequesting}
                tooltipData={{
                  description: "Permanently delete this message.",
                }}
              />
            )}
          </div>
        )}
        {emailable && (
          <div className="message__email-button-container">
            {emailable && (
              <Buttonlet
                type="envelope"
                onClick={handleClickEmail}
                disabled={isWorking || isRequesting}
                tooltipData={{ description: emailToolTip }}
                classNames={emailClassNames}
                showModalTooltipOnTouch={true}
              />
            )}
          </div>
        )}
        <div>
          {ago && <b>({ago})</b>} <span>{title}</span>
        </div>
        <div
          className="message__description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="buttons">{children}</div>
      </div>
    </div>
  );
}

MessageComponent.displayName = "MessageComponent";

interface OwnProps {
  children?: React.ReactNode;
  data: {
    ago: string;
    description: string;
    image: string;
    title: string;
  };
  deletable?: boolean;
  onDelete?: () => Promise<void>;
  emailable?: boolean;
  onEmail?: (hasMessagingEmail: boolean) => Promise<void>;
}

const mapStateToProps = (state: IAppState) => ({
  hasMessagingEmail: state.user.user?.hasMessagingEmail ?? false,
  isRequesting: state.messages.isRequesting,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MessageComponent);
