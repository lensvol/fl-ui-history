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
}: Props) {
  const { ago, description, image, title } = data;

  const isMounted = useIsMounted();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = useCallback(async () => {
    setIsDeleting(true);
    if (onDelete) {
      await onDelete();
    }
    if (isMounted.current) {
      setIsDeleting(false);
    }
  }, [onDelete, isMounted]);

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
                onClick={handleClick}
                disabled={isDeleting}
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
}

const mapStateToProps = (_: IAppState) => ({});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MessageComponent);
