// Example input : 2025LH02
// Expected output : '2026-2-01 00:00:00' & '2026-03-01 00:00:00'

const APRIL = 4;

const getDateRangeAtPeriode = (periode: string): [Date, Date] => {
  const yearInput = Number(periode.substring(0, 4));
  const monthInput = Number(periode.substring(6)) - 1;
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  startDate.setMonth(monthInput);
  if (monthInput < APRIL) {
    startDate.setFullYear(yearInput + 1);
  } else {
    startDate.setFullYear(yearInput);
  }
  const endDate = new Date(startDate.getTime());
  endDate.setMonth(endDate.getMonth() + 1, 1);

  return [startDate, endDate];
};

export default getDateRangeAtPeriode;
