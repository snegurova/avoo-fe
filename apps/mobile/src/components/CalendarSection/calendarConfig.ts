const SLOT_HEIGHT = 100;

export const calendarConfig = {
 timeline: {
  hours: Array.from({ length: 24 }, (_, i) => i),
  slotHeight: SLOT_HEIGHT,
  quarterHeight: SLOT_HEIGHT / 4,
  timeScaleWidth: 64,
 },
 monthView: {
  maxEventsPerDay: 3,
 },
 weekView: {
  maxEventsPerCell: 3,
  dayWidth: 120,
  masterColumnWidth: 64,
  masterRowHeight: 96,
  headerHeight: 64,
 },
 weekSingleMaster: {
  headerHeight: 64,
  dayWidth: 120,
 },
 dayView: {
  headerHeight: 80,
  baseColWidth: 120,
 },
};