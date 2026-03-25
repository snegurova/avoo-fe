const toDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

export const formatLocalizedDuration = (durationMinutes: number, locale: string): string => {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  const hourFormatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  });
  const minuteFormatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'minute',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  });

  if (hours === 0) {
    return minuteFormatter.format(minutes);
  }

  if (minutes === 0) {
    return hourFormatter.format(hours);
  }

  return `${hourFormatter.format(hours)} ${minuteFormatter.format(minutes)}`;
};

export const formatLocalizedCurrency = (
  amount: number,
  currency: string,
  locale: string,
  currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'symbol',
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
  }).format(amount);

export const formatLocalizedDate = (value: Date | string, locale: string): string => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale).format(date);
};

export const formatLocalizedHumanDate = (value: Date | string, locale: string): string => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const formatLocalizedWeekdayDayMonth = (value: Date | string, locale: string): string => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
};

export const getLocalizedDayMonthParts = (
  value: Date | string,
  locale: string,
): { day: string; month: string } => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: '--' };
  }

  return {
    day: new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
  };
};

export const formatRelativeTimeFromNow = (
  value: Date | string,
  locale: string,
  now: Date = new Date(),
): string => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const elapsedMs = date.getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const divisions = [
    { unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
    { unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
    { unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
    { unit: 'day', ms: 1000 * 60 * 60 * 24 },
    { unit: 'hour', ms: 1000 * 60 * 60 },
    { unit: 'minute', ms: 1000 * 60 },
    { unit: 'second', ms: 1000 },
  ] as const;

  for (const division of divisions) {
    const valueInUnit = elapsedMs / division.ms;

    if (Math.abs(valueInUnit) >= 1 || division.unit === 'second') {
      return rtf.format(Math.round(valueInUnit), division.unit);
    }
  }

  return '';
};
