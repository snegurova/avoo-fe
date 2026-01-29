export enum AnchorVertical {
  Top = 'top',
  Bottom = 'bottom',
}

export enum AnchorHorizontal {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export type AnchorOrigin = {
  vertical: AnchorVertical;
  horizontal: AnchorHorizontal;
};
