export function getRowPattern(tablet: boolean) {
  return tablet ? [1, 2, 3, 0] : [1, 0];
}

export function fillRow<MediaT>({
  startIdx,
  perRow,
  wideInRow,
  medias,
  result,
  wideIdxs,
}: {
  startIdx: number;
  perRow: number;
  wideInRow: number;
  medias: MediaT[];
  result: MediaT[];
  wideIdxs: number[];
}) {
  let idx = startIdx;
  for (let colIdx = 0; colIdx < perRow && idx < medias.length; colIdx++) {
    if (colIdx === wideInRow && idx < medias.length) {
      wideIdxs.push(result.length);
      result.push(medias[idx]);
      idx++;
    } else if (idx < medias.length) {
      result.push(medias[idx]);
      idx++;
    }
  }
  return idx;
}

export function fillSimpleRow<MediaT>({
  startIdx,
  perRow,
  medias,
  result,
}: {
  startIdx: number;
  perRow: number;
  medias: MediaT[];
  result: MediaT[];
}) {
  let idx = startIdx;
  for (let colIdx = 0; colIdx < perRow && idx < medias.length; colIdx++) {
    result.push(medias[idx]);
    idx++;
  }
  return idx;
}
