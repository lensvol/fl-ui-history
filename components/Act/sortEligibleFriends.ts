type HasName = { name: string };

export default function sortEligibleFriends(a: HasName, b: HasName) {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}
