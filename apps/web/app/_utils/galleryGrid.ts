export function getWideIndexes(perRow: number, total: number, isTabletUp: boolean): Set<number> {
  const result = new Set<number>();
  for (let i = 0; i < total; i += perRow) {
    const rowLength = Math.min(perRow, total - i);
    if (rowLength < 2) continue;
    let widePos;
    if (isTabletUp) {
      widePos = Math.floor(i / perRow) % 3;
      if (widePos >= rowLength) widePos = 0;
    } else {
      widePos = Math.floor(i / perRow) % 2;
      if (widePos >= rowLength) widePos = 0;
    }
    result.add(i + widePos);
  }
  return result;
}
