export default function parseMaintenanceEndTime(endTime: string | undefined): string | undefined {
  if (endTime === undefined) {
    return undefined;
  }
  if (endTime.length !== 4) {
    return undefined;
  }

  const hourString = endTime.substring(0, 2);
  const minutesString = endTime.substring(2);
  return `${hourString}.${minutesString}`;
}