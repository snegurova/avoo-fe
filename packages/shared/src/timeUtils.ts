import { DateStatus } from '@avoo/hooks/types/dateStatus';

export const timeUtils = {
  toDayBegin(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  toDayEnd(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59);
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
  getMinutesFromDate(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  },
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },
  isCurrentWeek(date: Date) {
    const now = new Date();
    const targetWeekRange = this.getWeekRange(date);

    return now >= targetWeekRange.start && now <= targetWeekRange.end;
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
  getDateStatus(date: Date): DateStatus {
    const today = this.toDayBegin(new Date());
    const targetDate = this.toDayBegin(date);

    if (targetDate.getTime() === today.getTime()) {
      return DateStatus.TODAY;
    } else if (targetDate < today) {
      return DateStatus.PAST;
    } else {
      return DateStatus.FUTURE;
    }
  },
  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) {
      const minuteText = minutes === 1 ? 'min' : 'mins';
      return `${minutes} ${minuteText}`;
    }
    if (minutes === 0) {
      const hourText = hours === 1 ? 'hour' : 'hours';
      return `${hours} ${hourText}`;
    }
    return `${hours}h ${minutes} mins`;
  },
  getDurationOptionsRange(
    minutesMin: number,
    minutesMax: number,
    step: number = 15,
  ): { label: string; value: number }[] {
    if (minutesMin > minutesMax) {
      return [];
    }

    const options: { label: string; value: number }[] = [];

    for (let minutes = minutesMin; minutes <= minutesMax; minutes += step) {
      options.push({
        value: minutes,
        label: this.convertDuration(minutes),
      });
    }

    return options;
  },

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  formatDateTimeRounded(date: Date, startTimeMinutes: number): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const roundedStartTimeMinutes = Math.ceil(startTimeMinutes / 15) * 15;
    const hours = Math.floor(roundedStartTimeMinutes / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (roundedStartTimeMinutes % 60).toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  },
  convertDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  },
  convertDateToRoundedString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const minutesTotal = date.getHours() * 60 + date.getMinutes();
    const roundedMinutesTotal = Math.ceil(minutesTotal / 15) * 15;
    const hours = Math.floor(roundedMinutesTotal / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (roundedMinutesTotal % 60).toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  },
  formatLastVisitDate(
    value: string | Date | Record<string, unknown> | null | undefined,
  ): string | null {
    if (value == null) return null;

    let date: Date | null = null;
    if (value instanceof Date) date = value;
    else if (typeof value === 'string') date = new Date(value);
    else return null;

    if (!date || isNaN(date.getTime())) return null;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  },
  formatToFullDate(date: string, time: string): string {
    return `${date}T${time}:00`;
  },
  getHumanDate(date: string): string {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    };
    return dateObj.toLocaleDateString('en-US', options);
  },
  getHumanDuration(durationMinutes: number): string {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const hoursPart = hours > 0 ? `${hours}h` : '';
    const minutesPart = minutes > 0 ? ` ${minutes} mins` : '00 mins';
    return `${hoursPart} ${minutesPart}`.trim();
  },
  getMinutesDifference(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
  },
  getEndTime(start: string, durationMinutes: number): string {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
};
