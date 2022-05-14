import moment from 'moment';

/**
 * Return true if the timestamp expires move than 5 minutes in the future, otherwise false.
 * @param timestamp
 * @returns {boolean}
 */
export default function isTimestampStillValid(timestamp) {
  return moment(new Date(timestamp * 1000))
    .add(5, 'minutes')
    .isAfter(new Date());
}