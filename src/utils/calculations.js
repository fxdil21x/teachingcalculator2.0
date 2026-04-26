import { MONTHS } from "./constants";

export function calculateMinutes(fromTime, toTime, breakMinutes) {
  const diff =
    (new Date(`1970-01-01T${toTime}`) - new Date(`1970-01-01T${fromTime}`)) / 60000 -
    (Number.parseInt(breakMinutes, 10) || 0);
  return diff;
}

export function calculateSalary(minutes, hourlyRate, tds) {
  const hours = minutes / 60;
  let salary = hours * (hourlyRate || 0);
  if (tds) salary *= 0.9;
  return salary;
}

export function buildEntryPayload(date, minutes, institute) {
  const d = new Date(date);
  return {
    date,
    minutes,
    instituteName: institute.name,
    hourlyRate: institute.hourlyRate,
    tds: institute.tds,
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear(),
  };
}

export function getYearForEntry(entry) {
  if (entry.year) return Number.parseInt(entry.year, 10);
  return MONTHS.indexOf(entry.month) <= 2 ? 2026 : 2025;
}

export function formatIndianCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}
