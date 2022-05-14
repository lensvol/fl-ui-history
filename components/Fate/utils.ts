import { IFateCard } from 'types/fate';
import { normalize } from 'utils/stringFunctions';
import { isNotUndefined } from 'utils';

export const DUMMY_YEAR_FOR_UNDATED_STORIES = 1970;

export function containsMatchAnywhereInCard(card: IFateCard, filterString: string): boolean {
  const stopPhraseList = [
    'season of',
  ];

  const normalizedFilterString = stopPhraseList
    .reduce((acc, next) => acc.replace(next, ''), normalize(filterString))
    .trim();

  return [
    card.name,
    card.author,
    card.description,
    card.factions,
    card.season,
    card.shortDescription,
  ]
    .filter(isNotUndefined)
    .map(s => normalize(s))
    .some((s: string) => s.indexOf(normalizedFilterString) >= 0);
}

export function getFactionList({ factions }: Partial<Pick<IFateCard, 'factions'>>): string[] {
  return factions?.split(',')
    .map(_ => _.trim())
    .filter(isNotUndefined)
    .filter(s => s !== '') ?? [];
}

export function getFormattedReleaseDate({ releaseDate }: Partial<Pick<IFateCard, 'releaseDate'>>): string | undefined {
  if (!releaseDate) {
    return undefined;
  }

  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date);
}

export function findFateCardMetaText(
  card: Partial<Pick<IFateCard, 'season' | 'releaseDate' | 'factions'>>,
): string | undefined {
  const {
    releaseDate,
    season,
  } = card;

  let s = '';

  const factionList = getFactionList(card);

  if (season || releaseDate) {
    if (!factionList.length) {
      s += 'This story was originally released';
    } else {
      s += 'Originally released';
    }

    if (releaseDate) {
      s += ` in ${getFormattedReleaseDate(card)}`;
    }

    if (season) {
      s += ` as part of the Season of ${season}`;
    }
  }

  if (factionList.length) {
    if (s) {
      s += ', this ';
    } else {
      s += 'This ';
    }
    s += 'story features';
  }

  if (s) {
    if (factionList.length) {
      return `${s}:`;
    }
    return `${s}.`;
  }

  return undefined;
}
