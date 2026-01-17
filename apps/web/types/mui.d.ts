import '@mui/material/styles';
import '@mui/material/Chip';

declare module '@mui/material/styles' {
  interface Mixins {
    menu: {
      itemHeight: number;
      itemPaddingTop: number;
      visibleItems: number;
      partialVisibleItem: number;
      width: number;
    };
    searchInput: {
      height: number;
      borderRadius: number;
      iconSize: number;
      iconMarginLeft: number;
      widthMd: string;
      widthLg: string;
      mrMd: number;
      mrLg: number;
    };
  }
  interface MixinsOptions {
    menu?: {
      itemHeight?: number;
      itemPaddingTop?: number;
      visibleItems?: number;
      partialVisibleItem?: number;
      width?: number;
    };
    searchInput?: {
      height?: number;
      borderRadius?: number;
      iconSize?: number;
      iconMarginLeft?: number;
      widthMd?: string;
      widthLg?: string;
      mrMd?: number;
      mrLg?: number;
    };
  }

  interface Palette {
    pending: Palette['primary'];
  }
  interface PaletteOptions {
    pending?: PaletteOptions['primary'];
  }
  interface Palette {
    confirmed: Palette['primary'];
  }
  interface PaletteOptions {
    confirmed?: PaletteOptions['primary'];
  }
  interface Palette {
    outOfSchedule: Palette['primary'];
  }
  interface PaletteOptions {
    outOfSchedule?: PaletteOptions['primary'];
  }
  interface TypeBackground {
    info: string;
    pending: string;
    confirmed: string;
    outOfSchedule: string;
  }
  interface Palette {
    background: TypeBackground;
  }
  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
  interface TypeText {
    info: string;
    pending: string;
    confirmed: string;
    outOfSchedule: string;
    white: string;
  }
  interface ShapeOptions {
    borderRadiusSm: number;
    borderRadiusMd: number;
    borderRadiusLg: number;
    borderRadiusXl: number;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    pending: true;
    outOfSchedule: true;
  }
}
