import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetch as fetchAvatars } from 'actions/registration';

import Avatar from './Avatar';

export class AvatarSelection extends Component {
  static displayName = 'AvatarSelection';

  componentDidMount = () => {
    const { avatars, dispatch } = this.props;
    if (!(avatars && avatars.length)) {
      dispatch(fetchAvatars());
    }
  };

  render = () => {
    const {
      avatar,
      avatars,
      onSelect,
    } = this.props;
    return (
      <Fragment>
        <p className="lede">Click the image that best represents you:</p>
        <ul className="signup-avatars">
          {avatars && avatars.map(name => (
            <Avatar
              key={name}
              name={name}
              active={name === avatar}
              onClick={() => onSelect(name)}
            />
          ))}
        </ul>
      </Fragment>
    );
  }
}


AvatarSelection.propTypes = {
  avatar: PropTypes.string,
  avatars: PropTypes.arrayOf(PropTypes.string),
  dispatch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

AvatarSelection.defaultProps = {
  avatar: undefined,
  avatars: undefined,
};

const mapStateToProps = ({ registration: { avatars, isFetching } }) => ({ avatars, isFetching });

export default connect(mapStateToProps)(AvatarSelection);