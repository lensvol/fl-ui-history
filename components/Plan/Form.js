import React from "react";
import PropTypes from "prop-types";

import Loading from "components/Loading";

export default class Form extends React.Component {
  state = {
    noteInput: "",
  };

  componentDidMount = () => {
    const {
      data: { notes },
    } = this.props;
    this.setState({
      noteInput: notes || "",
    });
  };

  handleChange = (e) => {
    this.setState({
      noteInput: e.target.value,
    });
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { data, isSaving, onSubmit, qualityRequirements } = this.props;
    const { noteInput } = this.state;

    return (
      <div>
        <form>
          <p className="form__group">
            <textarea
              className="form__control"
              placeholder="Add a note…"
              value={noteInput}
              onChange={this.handleChange}
            />
          </p>
          <div className="buttons">
            <button
              type="button"
              className="button button--primary"
              disabled={isSaving}
              onClick={() => onSubmit({ ...data, noteInput })}
            >
              {isSaving ? <Loading spinner small /> : "Save"}
            </button>
            {qualityRequirements}
          </div>
        </form>
      </div>
    );
  }
}

Form.displayName = "Form";

Form.propTypes = {
  data: PropTypes.shape({}).isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  qualityRequirements: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
