export default function canRenderQualityName(name?: string) {
  if (!name) {
    return false;
  }

  return (
    name
      .replaceAll("<i>", "")
      .replaceAll("</i>", "")
      .replaceAll("<em>", "")
      .replaceAll("</em>", "")
      .indexOf("<") === -1
  );
}
