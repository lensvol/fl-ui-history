import React from 'react';

interface Props {
  buttons: {
    label: string,
    action: () => void,
  }[],
}

export default function TooltipButtons({ buttons }: Props) {
  return (
    <div className="buttons tooltip__buttons">
      {buttons.map(({ action, label }) => (
        <button
          key={label}
          className="button button--primary button--sm button--tooltip"
          onClick={action}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
