import { IQuality } from "types/qualities";

export default function sortContacts(a: IQuality, b: IQuality) {
  if (!(a.category === b.category && a.category === "Contacts")) {
    return a.name.localeCompare(b.name);
  }
  // List Connected qualities first; note that we're using indexOf rather
  // than startsWith because we're not polyfilling startsWith support any more
  if (a.name.indexOf("Connected") === 0 && b.name.indexOf("Connected") === 0) {
    return a.name.localeCompare(b.name);
  }
  if (a.name.indexOf("Connected") === 0) {
    return -1;
  }
  if (b.name.indexOf("Connected") === 0) {
    return 1;
  }

  try {
    // List factions together, with favours listed before renown
    const re = /^(Favours|Renown): ([^\d]+)/;
    // Either of these may be null, but we're coercing them and catching exceptions below
    const aFaction = re.exec(a.name)![2].trim();
    const bFaction = re.exec(b.name)![2].trim();
    if (aFaction === bFaction) {
      // Same faction, so just sort on F/R
      return a.name.localeCompare(b.name);
    }
    // Compare factions
    return aFaction.localeCompare(bFaction);
  } catch (e) {
    // Something that doesn't match our regex is in here, so just do
    // a name comparison
    return a.name.localeCompare(b.name);
  }
}
