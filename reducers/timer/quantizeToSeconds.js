export default function quantizeToSeconds(time) {
  return 1000 * Math.floor((time <= 0 ? 0 : time) / 1000);
}
