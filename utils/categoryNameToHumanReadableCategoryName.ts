export default function categoryNameToHumanReadableCategoryName(name: string) {
  if (name === "HomeComfort") {
    return "Home Comfort";
  }
  if (name === "ToolOfTheTrade") {
    return "Tools of the Trade";
  }
  return name;
}
