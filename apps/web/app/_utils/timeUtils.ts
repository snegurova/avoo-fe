export const timeUtils = {
  toDayBegin(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  toDayEnd(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },
  getMinutesInDay(date: string): number {
    const dateObj = new Date(date);
    return dateObj.getHours() * 60 + dateObj.getMinutes();
  },
  getTime(date: string): string {
    const dateObj = new Date(date);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
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
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },
  getDayRange(date: Date): { start: Date; end: Date } {
    const start = this.toDayBegin(date);
    const end = this.toDayEnd(date);
    return { start, end };
  },
  getWeekRange(date: Date): { start: Date; end: Date } {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: this.toDayBegin(monday),
      end: this.toDayEnd(sunday),
    };
  },
  getMonthRange(date: Date): { start: Date; end: Date } {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfWeek = lastDayOfMonth.getDay();
    const diffToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
    const diffToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    const monthStart = new Date(firstDayOfMonth);
    monthStart.setDate(firstDayOfMonth.getDate() + diffToMonday);
    const monthEnd = new Date(lastDayOfMonth);
    monthEnd.setDate(lastDayOfMonth.getDate() + diffToSunday);
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
