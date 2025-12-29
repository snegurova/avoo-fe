/// <reference types="nativewind/types" />

declare module 'tailwindcss' {
  interface Config {
    presets?: unknown[];
    content?: string | string[];
    theme?: {
      colors?: Record<string, string | Record<string, string>>;
      fontSize?: Record<string, number | string | [string, string] | [string, { lineHeight?: string; letterSpacing?: string; fontWeight?: string | number }]>;
      fontWeight?: Record<string, number | string>;
      extend?: {
        spacing?: Record<string, number | string>;
        borderRadius?: Record<string, number | string>;
      };
      [key: string]: unknown;
    };
    plugins?: unknown[];
    [key: string]: unknown;
  }
}
