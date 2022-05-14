import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import { updateDescription } from 'actions/profile';


import EditToggle from './EditToggle';
import TheySayForm from './TheySayForm';
import TheySayStatic from './TheySayStatic';

type State = {
  isEditing: boolean,
};

class TheySay extends Component<Props, State> {
  static displayName = 'TheySay';

  state = {
    isEditing: false,
  };

  handleSubmit = async (values: any) => {
    const { dispatch } = this.props;
    const { description } = values;
    await dispatch(updateDescription(description));
    this.setState({ isEditing: false });
  };

  handleToggleIsEditing = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  };

  renderTransitionContent = () => {
    const { profileCharacter: { description } } = this.props;
    const { isEditing } = this.state;
    if (isEditing) {
      return <TheySayForm key="form" initialValue={description} onSubmit={this.handleSubmit} />;
    }
    return <TheySayStatic key="static" description={description} />;
  };

  render() {
    const { editable } = this.props;
    const { isEditing } = this.state;

    return (
      <div className="snippet profile__snippet">
        <div className="they-say__header-row">
          <h3 className="heading heading--2 they-say__heading">They say...</h3>
          {editable && <EditToggle isEditing={isEditing} onClick={this.handleToggleIsEditing} />}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <ReactCSSTransitionReplace
            // @ts-ignore
            childComponent="div"
            transitionName="cross-fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {this.renderTransitionContent()}
          </ReactCSSTransitionReplace>
        </div>
      </div>
    );
  }
}

type Props = {
  dispatch: Function,
  editable?: boolean,
  profileCharacter: { description: string },
};

/*
TheySay.propTypes = {
  editable: PropTypes.bool,
  profileCharacter: PropTypes.shape({
    description: PropTypes.string.isRequired,
  }).isRequired,
};

TheySay.defaultProps = {
  editable: false,
};
*/

export default connect()(TheySay);
