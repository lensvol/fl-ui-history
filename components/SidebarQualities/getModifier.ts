export default function getModifier({
  effectiveLevel,
  level,
}: {
  effectiveLevel: number;
  level: number;
}) {
  const difference = effectiveLevel - level;
  if (difference === 0) {
    return null; // Render nothing if there's no modifier
  }
  if (difference < 0) {
    return `${difference.toLocaleString("en-GB")}`;
  }
  return `+${difference.toLocaleString("en-GB")}`;
}
