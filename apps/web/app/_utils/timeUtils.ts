export const timeUtils = {
  toDayBegin(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  },
  getMinutesInDay(date: string): number {
    const dateObj = new Date(date);
    return dateObj.getUTCHours() * 60 + dateObj.getUTCMinutes();
  },
  getTime(date: string): string {
    const dateObj = new Date(date);
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
};
