export const calendarUtils = {
  startOfMonthGrid: (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - (day - 1));
    return d;
  },
  endOfMonthGrid: (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0, 0);
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() + (7 - day));
    return d;
  },
  getMonthGridDays: (month: Date): Date[] => {
    const gridStart = calendarUtils.startOfMonthGrid(month);
    const gridEnd = calendarUtils.endOfMonthGrid(month);
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((gridEnd.getTime() - gridStart.getTime()) / MS_PER_DAY) + 1;
    const weeksCount = Math.ceil(totalDays / 7);
    return Array.from({ length: weeksCount * 7 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  },
  getMonthGridRows: (days: Date[]): Date[][] => {
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  },
  toDateKeyLocal: (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },
  isSameMonth: (date: Date, month: Date) => date.getMonth() === month.getMonth(),
  isToday: (date: Date) => date.toDateString() === new Date().toDateString(),
  getDayViewColWidth: (containerWidth: number, mastersCount: number, baseColWidth: number) => {
    if (!containerWidth) return baseColWidth;
    if (mastersCount <= 2) {
      const stretched = Math.floor(containerWidth / Math.max(1, mastersCount));
      return Math.max(baseColWidth, stretched);
    }
    return baseColWidth;
  },
  parseTimeToMinutes: (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  },
  calculateTop: (startTime: string, slotHeight: number) =>
    (calendarUtils.parseTimeToMinutes(startTime) / 60) * slotHeight,
  calculateHeight: (startTime: string, endTime: string, slotHeight: number) =>
    ((calendarUtils.parseTimeToMinutes(endTime) - calendarUtils.parseTimeToMinutes(startTime)) /
      60) *
    slotHeight,
  getColumnStyle: (width: number | undefined, contentHeight: number) =>
    width != null ? { width, height: contentHeight } : { height: contentHeight },
};
