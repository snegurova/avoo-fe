import { Currency } from "./types/currency";


export const currencyUtils = {
  getCurrencySymbol(currency: Currency): string {
    const SYMBOLS: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      UAH: '₴',
    };
    return SYMBOLS[currency] || currency;
  },
  getCurrencyName(currency: Currency): string {
    const NAMES: Record<Currency, string> = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      UAH: 'Ukrainian Hryvnia',
    };
    return NAMES[currency] || currency;
  },

  formatPrice(price: number, currency: Currency): string {
    return `${this.getCurrencySymbol(currency)}${price}`;
  },
  formatNamePrice(price: number, currency: Currency): string {
    return `${price} ${this.getCurrencyName(currency)}`;
  },
};
