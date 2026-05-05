import React, { useCallback, useMemo } from "react";

import AvatarSelection from "components/CreateCharacter/components/AvatarSelection";
import GenderOptions from "components/CreateCharacter/components/GenderOptions";
import NameForm from "components/CreateCharacter/components/NameForm";
import TitleBar from "components/CreateCharacter/components/TitleBar";
import Loading from "components/Loading";
import TouchModalTooltip from "components/Tooltip/TouchModalTooltip";

type Props = {
  avatar?: string;
  canSubmit: boolean;
  gender?: string;
  isSubmitting: boolean;
  nameError?: string;
  onChangeGender: (gender: string) => void;
  onRequestCancel: () => void;
  onSelectAvatar: (avatar: string) => void;
  onSubmit: () => Promise<void>;
};

export default function CreateCharacterComponent({
  avatar,
  canSubmit,
  gender,
  isSubmitting,
  nameError,
  onChangeGender,
  onRequestCancel,
  onSelectAvatar,
  onSubmit,
}: Props) {
  const onClick = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    onSubmit();
  }, [canSubmit, onSubmit]);

  const tooltipData = useMemo(() => {
    if (canSubmit) {
      return undefined;
    }

    const reasons = [
      nameError,
      gender ? undefined : "You need to choose a gender.",
      avatar
        ? undefined
        : "You need to choose an image to represent your character.",
    ].filter((reason) => reason);

    return {
      description: reasons.join(" "),
    };
  }, [avatar, canSubmit, gender, nameError]);

  return (
    <div className="content container create-character">
      <TitleBar />
      <div className="tab-content tab-content--inverse create-character__form">
        <div className="tab-content__bordered-container">
          <h2 className="heading heading--2">Welcome, Delicious Friend</h2>
          <p className="lede">
            You are only a few moments away from Fallen London…
          </p>
          <p className="create-character__initial-rubric">
            First we need to know a little about you.
            <button
              className="button button--tertiary button--sm"
              onClick={onRequestCancel}
              type="button"
            >
              Quit character creation
            </button>
          </p>
          <hr />
          <NameForm />
          <GenderOptions gender={gender} onChange={onChangeGender} />
          <AvatarSelection avatar={avatar} onSelect={onSelectAvatar} />
          <div className="u-text-center">
            {tooltipData ? (
              <TouchModalTooltip tooltipData={tooltipData}>
                <button
                  className="button button--primary button--disabled"
                  type="button"
                >
                  Play Fallen London
                </button>
              </TouchModalTooltip>
            ) : (
              <button
                className="button button--primary"
                disabled={isSubmitting}
                type="button"
                onClick={onClick}
              >
                {isSubmitting ? (
                  <Loading spinner small />
                ) : (
                  "Play Fallen London"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CreateCharacterComponent.displayName = "CreateCharacterComponent";
