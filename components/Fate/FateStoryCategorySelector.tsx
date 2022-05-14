import CategorySelector from 'components/CategorySelector';
import React, {
  useMemo,
} from 'react';
import { IFateCard } from 'types/fate';

export default function FateStoryCategorySelector({ cards, gotoItem }: Props) {
  const items = useMemo(
    () => {
      const uniqueYears = Array.from(new Set(cards.map(card => new Date(card.releaseDate).getFullYear())));
      return uniqueYears.map(year => ({ name: year.toString() }));
    },
    [cards],
  );

  return (
    <CategorySelector
      data={items}
      gotoItem={gotoItem}
      style={{ marginBottom: '1rem' }}
    />
  );
}

type Props = {
  cards: IFateCard[],
  gotoItem: (args?: any) => void,
};