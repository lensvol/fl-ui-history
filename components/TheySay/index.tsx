import React, { useCallback, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import EditToggle from "components/TheySay/EditToggle";
import TheySayForm from "components/TheySay/TheySayForm";
import TheySayStatic from "components/TheySay/TheySayStatic";

import { useAppDispatch, useAppSelector } from "features/app/store";
import { updateDescription } from "features/profile";

export default function TheySay() {
  const dispatch = useAppDispatch();

  const editable = useAppSelector((s) => s.profile.isLoggedInUsersProfile);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = useCallback(
    async (values: { description: string }) => {
      await dispatch(updateDescription(values));

      setIsEditing(false);
    },
    [dispatch]
  );

  const handleToggleIsEditing = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  if (!profileCharacter) {
    return null;
  }

  return (
    <>
      <div className="they-say__header-row">
        <h3 className="heading heading--2 they-say__heading">They say...</h3>

        {editable && (
          <EditToggle isEditing={isEditing} onClick={handleToggleIsEditing} />
        )}
      </div>

      <div className="they-say__body">
        <ReactCSSTransitionReplace
          // @ts-ignore
          childComponent="div"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
          transitionName="cross-fade"
        >
          <TransitionContent
            description={profileCharacter.description}
            isEditing={isEditing}
            onSubmit={handleSubmit}
          />
        </ReactCSSTransitionReplace>
      </div>
    </>
  );
}

TheySay.displayName = "TheySay";

interface TransitionContentProps {
  description: string;
  isEditing: boolean;
  onSubmit: (values: { description: string }) => Promise<void>;
}

function TransitionContent({
  description,
  isEditing,
  onSubmit,
}: TransitionContentProps) {
  if (isEditing) {
    return (
      <TheySayForm initialValue={description} key="form" onSubmit={onSubmit} />
    );
  }

  return <TheySayStatic description={description} key="static" />;
}

TransitionContent.displayName = "TransitionContent";
