import React, { useCallback, useRef, useState } from "react";
import { connect } from "react-redux";

import { IAppState } from "types/app";
import TippyWrapper from "components/TippyWrapper";
import ChangeNameModal from "./ChangeNameModal";

const tooltipData = {
  name: "Change your name!",
  description: "You need at least 15 Fate to do this",
};

function Name({ name }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <TippyWrapper tooltipData={tooltipData}>
        <button
          ref={ref}
          className="button--link button--link-inverse"
          onClick={handleClick}
          type="button"
        >
          {name}
        </button>
      </TippyWrapper>
      <ChangeNameModal
        isOpen={isModalOpen}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

Name.displayName = "Name";

const mapStateToProps = ({
  myself: {
    character: { name },
  },
}: IAppState) => ({ name });
type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Name);
