import moment from "moment";

export default function computeNextActionsAt({
  currentTime,
  nextActionAt,
}: {
  currentTime: string;
  nextActionAt: string;
}) {
  // The difference between the `CurrentTime` and `NextActionsAt` on the server
  // is the amount of time left before the rollover. It doesn't matter what the
  // time is on the client.
  //
  // Note that this doesn't account for latency, namely the time elapsed between
  // building the response on the server and it reaching this point in the code.
  // But this should really not be a significant difference (millisecond-scale);
  // if it is, we'll need to take another look.
  const timeLeft = moment(moment(nextActionAt)).diff(moment(currentTime));
  return moment().add(timeLeft).toString();
}
