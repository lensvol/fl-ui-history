import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import updateJournalTag from "actions/journal/updateJournalTag";

import { JournalTagColor, JournalTagEntry } from "types/journal";

export type Props = {
  tag: JournalTagEntry;
};

const TagColors: JournalTagColor[] = [
  "Green",
  "Red",
  "Yellow",
  "Blue",
  "Violet",
];

export default function JournalTagColorPicker({ tag }: Props) {
  const dispatch = useDispatch();

  const onToggleColor = useCallback(
    async (color: JournalTagColor) => {
      const newColor = tag.color === color ? "None" : color;

      await dispatch(
        updateJournalTag({
          id: tag.id,
          color: newColor,
        })
      );
    },
    [dispatch, tag]
  );

  return (
    <div className="journal-tag-color-picker">
      {TagColors.map((color) => (
        <div
          key={color}
          className={classnames(
            "journal-tag-color",
            `journal-tag-bg-${color.toLocaleLowerCase()}`,
            tag.color === color && "journal-tag-selected"
          )}
          onClick={() => onToggleColor(color)}
        />
      ))}
    </div>
  );
}

JournalTagColorPicker.displayName = "JournalTagColorPicker";
