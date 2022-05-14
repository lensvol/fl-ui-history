import React from 'react';

import Loading from 'components/Loading';

type Props = {
  actions: number,
  data: any,
  isWorking: boolean | undefined,
};

class ButtonLabel extends React.Component<Props> {
  static displayName = 'ButtonLabel';
  render = () => {
    const {
      actions,
      children,
      data,
      isWorking,
    } = this.props;
    if (isWorking) {
      return <Loading spinner small />;
    }
    if (children) {
      return children;
    }
    if (actions < data.actionCost) {
      return <span>Not enough actions</span>;
    }

    if (data.currencyLocked) {
      return <span>Locked</span>;
    }

    if (data.requirementLocked) {
      return <span>Locked</span>;
    }

    if (data.buttonText) {
      return <span dangerouslySetInnerHTML={{ __html: data.buttonText }} />;
    }
    return <span>Go</span>;
  };
}

ButtonLabel.displayName = 'ButtonLabel';

export default ButtonLabel;