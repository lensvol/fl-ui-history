export default function quantizeToSeconds(time: number) {
  return 1000 * Math.floor((time <= 0 ? 0 : time) / 1000);
}
