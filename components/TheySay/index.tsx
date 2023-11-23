import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useState } from "react";
import ReactCSSTransitionReplace from "react-css-transition-replace";

import { updateDescription } from "features/profile";

import EditToggle from "./EditToggle";
import TheySayForm from "./TheySayForm";
import TheySayStatic from "./TheySayStatic";

export default function TheySay() {
  const dispatch = useAppDispatch();

  const editable = useAppSelector((s) => s.profile.isLoggedInUsersProfile);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = useCallback(
    async (values: { description: string }) => {
      const { description } = values;
      await dispatch(updateDescription({ description }));
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

  const { description } = profileCharacter;

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
          transitionName="cross-fade"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          <TransitionContent
            description={description}
            isEditing={isEditing}
            onSubmit={handleSubmit}
          />
        </ReactCSSTransitionReplace>
      </div>
    </>
  );
}

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
      <TheySayForm key="form" initialValue={description} onSubmit={onSubmit} />
    );
  }
  return <TheySayStatic key="static" description={description} />;
}
