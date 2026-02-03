export enum AnchorVertical {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum AnchorHorizontal {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export type AnchorOrigin = {
  vertical: AnchorVertical;
  horizontal: AnchorHorizontal;
};
