export const timeUtils = {
  toDayBegin(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  },
  toDayEnd(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999);
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
  getTimeFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  },
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  },
  getDayRange(date: Date): { start: Date; end: Date } {
    const start = this.toDayBegin(date);
    const end = this.toDayEnd(date);
    return { start, end };
  },
  getWeekRange(date: Date): { start: Date; end: Date } {
    const dayOfWeek = date.getUTCDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return {
      start: this.toDayBegin(monday),
      end: this.toDayEnd(sunday),
    };
  },
  getMonthRange(date: Date): { start: Date; end: Date } {
    const firstDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const lastDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    const firstDayOfWeek = firstDayOfMonth.getUTCDay();
    const lastDayOfWeek = lastDayOfMonth.getUTCDay();
    const diffToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
    const diffToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    const monthStart = new Date(firstDayOfMonth);
    monthStart.setUTCDate(firstDayOfMonth.getUTCDate() + diffToMonday);
    const monthEnd = new Date(lastDayOfMonth);
    monthEnd.setUTCDate(lastDayOfMonth.getUTCDate() + diffToSunday);
    return {
      start: this.toDayBegin(monthStart),
      end: this.toDayEnd(monthEnd),
    };
  },
  getWeekDay(day: number): string {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return weekDays[day];
  },
};
