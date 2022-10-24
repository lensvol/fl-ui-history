import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";

import { suggestContact } from "actions/storylet";

import Loading from "components/Loading";

export function SuggestContactButton({
  branchId,
  dispatch,
  onSuggestComplete,
}: Props) {
  const mounted = useIsMounted();
  const [isWaitingForSuggestion, setIsWaitingForSuggestion] = useState(false);

  const handleClick = useCallback(async () => {
    // this.setState({ isWaitingForSuggestion: true });
    setIsWaitingForSuggestion(true);
    try {
      // Make the request
      const data = await dispatch(suggestContact(branchId));
      // Pass the response to our parent
      onSuggestComplete(data);
    } catch (error) {
      console.error(error);
    } finally {
      if (mounted.current) {
        setIsWaitingForSuggestion(false);
      }
    }
  }, [branchId, dispatch, mounted, onSuggestComplete]);

  return (
    <button
      className="button button--tertiary button--no-margin"
      disabled={isWaitingForSuggestion}
      onClick={handleClick}
      type="button"
    >
      {isWaitingForSuggestion ? <Loading spinner small /> : "Suggest a contact"}
    </button>
  );
}

SuggestContactButton.displayName = "SuggestContactButton";

type OwnProps = {
  branchId: number;
  onSuggestComplete: (args?: any) => void;
};

type Props = OwnProps & {
  dispatch: Function; // eslint-disable-line
};

export default connect()(SuggestContactButton);
