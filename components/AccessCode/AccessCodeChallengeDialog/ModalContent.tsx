import React, {
  Fragment,
  useCallback,
  useState,
} from 'react';

import Image from 'components/Image';
import useIsMounted from 'hooks/useIsMounted';

export default function ModalContent({
  image,
  message,
  onClick,
}: Props) {
  const [isWorking, setIsWorking] = useState(false);

  const isMounted = useIsMounted();

  const handleClick = useCallback(async () => {
    setIsWorking(true);
    await onClick();
    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [
    isMounted,
    onClick,
  ]);

  return (
    <Fragment>
      <div className="media">
        <div className="media__left">
          <Image
            type="icon"
            icon={image}
          />
        </div>
        {message !== undefined && (
          <div
            className="media__body"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </div>
      <div className="buttons">
        <button
          type="button"
          className="button button--primary"
          disabled={isWorking}
          onClick={handleClick}
        >
          Continue
        </button>
      </div>
    </Fragment>
  );
}

ModalContent.displayName = 'ModalContent';

interface Props {
  image: string | undefined,
  message: string | undefined,
  onClick: () => Promise<void>,
}
