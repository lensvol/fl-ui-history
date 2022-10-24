import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import Loading from "components/Loading";

import AvatarSelection from "./components/AvatarSelection";
import NameForm from "./components/NameForm";
import TitleBar from "./components/TitleBar";
import GenderOptions from "./components/GenderOptions";

export default function CreateCharacterComponent(props) {
  const {
    avatar,
    canSubmit,
    errors,
    gender,
    isSubmitting,
    onChangeGender,
    onRequestCancel,
    onSelectAvatar,
    onSubmit,
  } = props;
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
          <NameForm error={errors.character} />
          <GenderOptions gender={gender} onChange={onChangeGender} />
          <AvatarSelection avatar={avatar} onSelect={onSelectAvatar} />
          <p className="u-text-center">
            <button
              className={classnames(
                "button button--primary",
                !canSubmit && "button--disabled"
              )}
              disabled={isSubmitting || !canSubmit}
              type="button"
              onClick={onSubmit}
            >
              {isSubmitting ? <Loading spinner small /> : "Play Fallen London"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

CreateCharacterComponent.displayName = "CreateCharacterComponent";

CreateCharacterComponent.propTypes = {
  avatar: PropTypes.string,
  canSubmit: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    character: PropTypes.string,
  }).isRequired,
  gender: PropTypes.string,
  isSubmitting: PropTypes.bool.isRequired,
  onChangeGender: PropTypes.func.isRequired,
  onRequestCancel: PropTypes.func.isRequired,
  onSelectAvatar: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CreateCharacterComponent.defaultProps = {
  avatar: undefined,
  gender: undefined,
};
