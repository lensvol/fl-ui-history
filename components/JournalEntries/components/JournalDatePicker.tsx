import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import moment from 'moment';

interface State {
  value: Date,
}

export default class JournalDatePicker extends Component<Props, State> {
  state = {
    value: moment(new Date()).subtract(122, 'years').toDate(),
  }

  handleChange = (date: Date | Date[]) => {
    const { onChange } = this.props;
    if (date instanceof Date) {
      this.setState({ value: date });
      onChange(date);
    }
  }

  render = () => {
    const { value } = this.state;
    return (
      <DatePicker
        className="journal-date-picker"
        maxDate={new Date()}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}

interface Props {
  onChange: (date: Date) => void,
}

/*
JournalDatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};

 */