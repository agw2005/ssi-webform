const Months = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

const getCurrentPeriod = (inputYear?: number, inputMonth?: number) => {
  const year = inputYear || new Date().getFullYear();
  const month = inputMonth || new Date().getMonth() + 1;
  const formattedYear = month < Months.April ? year - 1 : year;
  const formattedMonth = month < Months.October ? `0${month}` : String(month);
  const type = month > Months.September || month < Months.April ? "LH" : "FH";
  return `${formattedYear}${type}${formattedMonth}`;
};

export default getCurrentPeriod;
