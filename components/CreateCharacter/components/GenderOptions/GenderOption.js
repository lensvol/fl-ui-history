import React, { Component } from "react";
import PropTypes from "prop-types";

export default class GenderOption extends Component {
  static displayName = "GenderOption";

  handleChange = () => {
    const { value, onChange } = this.props;
    onChange(value);
  };

  render = () => {
    const { children, gender, id, value } = this.props;
    return (
      <p className="radio gender-option">
        <label className="gender-option__label" htmlFor={id}>
          <input
            id={id}
            value={value}
            name="gender"
            className="js-signup-gender gender-option__input"
            type="radio"
            onChange={this.handleChange}
            checked={gender === value}
          />{" "}
          {children}
        </label>
      </p>
    );
  };
}

GenderOption.propTypes = {
  children: PropTypes.node.isRequired,
  gender: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

GenderOption.defaultProps = {
  gender: undefined,
};
