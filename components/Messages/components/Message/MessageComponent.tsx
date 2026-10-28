import React, { useCallback, useState } from "react";

import Buttonlet from "components/Buttonlet";
import Image from "components/Image";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import { FeedMessage } from "types/messages";

interface Props {
  children?: React.ReactNode;
  data: FeedMessage;
  deletable?: boolean;
  emailable?: boolean;
  onDelete?: () => Promise<void>;
  onEmail?: (hasMessagingEmail: boolean) => Promise<void>;
}

export default function MessageComponent({
  children,
  data,
  deletable,
  emailable,
  onDelete,
  onEmail,
}: Props) {
  const hasMessagingEmail =
    useAppSelector((state) => state.user.user?.hasMessagingEmail) ?? false;
  const isRequesting = useAppSelector((state) => state.messages.isRequesting);

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
  }, [isMounted, onDelete]);

  const handleClickEmail = useCallback(async () => {
    setIsWorking(true);

    if (onEmail) {
      await onEmail(hasMessagingEmail);
    }

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [hasMessagingEmail, isMounted, onEmail]);

  const emailToolTip = hasMessagingEmail
    ? "Email a copy of this message to yourself."
    : "Your account must have an email address associated with it to send this message to yourself.";

  const emailClassNames = hasMessagingEmail
    ? undefined
    : {
        buttonletClassName: "buttonlet-disabled",
      };

  return (
    <div className="media--message">
      <div className="media__left message__left">
        <span className="message__image">
          <Image
            alt="A Message"
            className="media__object"
            defaultCursor
            height={52}
            icon={image}
            type="icon"
            width={40}
          />
        </span>
      </div>

      <div className="media__body message__body">
        {deletable && (
          <div className="message__delete-button-container">
            {deletable && (
              <Buttonlet
                disabled={isWorking || isRequesting}
                onClick={handleClickDelete}
                tooltipData={{
                  description: "Permanently delete this message.",
                }}
                type="close"
              />
            )}
          </div>
        )}

        {emailable && (
          <div className="message__email-button-container">
            {emailable && (
              <Buttonlet
                classNames={emailClassNames}
                disabled={isWorking || isRequesting}
                onClick={handleClickEmail}
                showModalTooltipOnTouch={true}
                tooltipData={{
                  description: emailToolTip,
                }}
                type="envelope"
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
