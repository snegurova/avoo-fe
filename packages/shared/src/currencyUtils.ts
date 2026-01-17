export const currencyUtils = {
  getCurrencySymbol(currency: string): string {
    const SYMBOLS = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      UAH: '₴',
    };
    return SYMBOLS[currency] || currency;
  },
  getCurrencyName(currency: string): string {
    const NAMES = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      UAH: 'Ukrainian Hryvnia',
    };
    return NAMES[currency] || currency;
  },

  formatPrice(price: number, currency: string): string {
    return `${this.getCurrencySymbol(currency)}${price}`;
  },
  formatNamePrice(price: number, currency: string): string {
    return `${price} ${this.getCurrencyName(currency)}`;
  },
};
