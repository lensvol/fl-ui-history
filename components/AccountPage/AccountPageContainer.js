import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchContacts } from "actions/contacts";

import Account from "components/Account";
import Header from "components/Header";

class AccountPageContainer extends Component {
  componentDidMount = () => {
    const { contacts, dispatch, user } = this.props;

    if (user.loggedIn) {
      if (!contacts.length) {
        dispatch(fetchContacts());
      }
    }
  };

  render() {
    return (
      <Fragment>
        <Header />
        <Account />
      </Fragment>
    );
  }
}

AccountPageContainer.displayName = "AccountPageContainer";

AccountPageContainer.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
};

AccountPageContainer.defaultProps = {
  data: null,
};

const mapStateToProps = ({ contacts: { contacts }, user }) => ({
  contacts,
  user,
});

export default connect(mapStateToProps)(AccountPageContainer);
