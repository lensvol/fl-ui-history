export default function sortEligibleFriends(
  a: { name: string },
  b: { name: string }
) {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}
