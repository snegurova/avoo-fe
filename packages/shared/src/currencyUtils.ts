export const currencyUtils = {
  getCurrencySymbol(currency: string): string {
    const SYMBOLS = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      UAH: '₴',
    } as const;

    return SYMBOLS[currency as keyof typeof SYMBOLS] || currency;
  },

  getCurrencyName(currency: string): string {
    const NAMES = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      UAH: 'Ukrainian Hryvnia',
    } as const;

    return NAMES[currency as keyof typeof NAMES] || currency;
  },

  formatPrice(price: number, currency: string, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price);
  },

  formatNamePrice(price: number, currency: string, locale = 'en-US'): string {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    return `${formatted} ${this.getCurrencyName(currency)}`;
  },
};
