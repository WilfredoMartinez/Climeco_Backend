const BASE_CHAR = 'a'.charCodeAt(0);
const MAX_CHAR = 'z'.charCodeAt(0);
const MIN_RANK = 'a';

export function generateInitialRank(): string {
  return 'm';
}

export function generateRankBetween(
  prevRank: string | null,
  nextRank: string | null
): string {
  if (!prevRank && !nextRank) return generateInitialRank();

  if (!prevRank) return generateRankBefore(nextRank!);

  if (!nextRank) return generateRankAfter(prevRank);

  return generateRankMiddle(prevRank, nextRank);
}

function generateRankBefore(rank: string): string {
  const firstChar = rank.charCodeAt(0);

  if (firstChar === BASE_CHAR) return MIN_RANK + rank;

  return String.fromCharCode(firstChar - 1);
}

function generateRankAfter(rank: string): string {
  const lastChar = rank.charCodeAt(rank.length - 1);

  if (lastChar === MAX_CHAR) return rank + MIN_RANK;

  const newLastChar = String.fromCharCode(lastChar + 1);

  return rank.slice(0, -1) + newLastChar;
}

function generateRankMiddle(prevRank: string, nextRank: string): string {
  const maxLength = Math.max(prevRank.length, nextRank.length);
  const prev = prevRank.padEnd(maxLength, MIN_RANK);
  const next = nextRank.padEnd(maxLength, MIN_RANK);

  let result = '';
  let carry = 0;

  for (let i = 0; i < maxLength; i++) {
    const prevCode = prev.charCodeAt(i) - BASE_CHAR;
    const nextCode = next.charCodeAt(i) - BASE_CHAR;

    const mid = Math.floor((prevCode + nextCode) / 2) + carry;

    if (mid === prevCode && i === maxLength - 1) {
      result = prev + MIN_RANK;
      break;
    }

    result += String.fromCharCode(BASE_CHAR + mid);
    carry = 0;

    if (prevCode !== nextCode) break;
  }

  return result;
}

export function generateRanksForArray(count: number): string[] {
  if (count === 0) return [];
  if (count === 1) return [generateInitialRank()];

  const ranks: string[] = [];
  let currentRank: string | null = null;

  for (let i = 0; i < count; i++) {
    const nextRank = generateRankBetween(currentRank, null);
    ranks.push(nextRank);
    currentRank = nextRank;
  }

  return ranks;
}

export function reorderArray(
  items: Array<{ id: string; order: string }>,
  fromIndex: number,
  toIndex: number
): Array<{ id: string; order: string }> {
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  const prevRank = toIndex > 0 ? result[toIndex - 1].order : null;
  const nextRank =
    toIndex < result.length - 1 ? result[toIndex + 1].order : null;

  result[toIndex] = {
    ...removed,
    order: generateRankBetween(prevRank, nextRank)
  };

  return result;
}

export function reorderByIdArray(
  currentItems: Array<{ id: string; order: string }>,
  newOrderIds: string[]
): Array<{ id: string; order: string }> {
  const itemsMap = new Map(currentItems.map((item) => [item.id, item]));
  const result: Array<{ id: string; order: string }> = [];

  for (let i = 0; i < newOrderIds.length; i++) {
    const item = itemsMap.get(newOrderIds[i]);
    if (!item) continue;

    const prevRank = i > 0 ? result[i - 1].order : null;
    const nextRank: string | null = null;

    result.push({
      id: item.id,
      order: generateRankBetween(prevRank, nextRank)
    });
  }

  return result;
}
