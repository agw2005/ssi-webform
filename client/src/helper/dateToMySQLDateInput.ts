const dateToMySQLDateInput = (date: Date) => {
  const padOut = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${padOut(date.getMonth() + 1)}-${padOut(date.getDate())} ${padOut(date.getHours())}:${padOut(date.getMinutes())}:${padOut(date.getSeconds())}`;
};

export default dateToMySQLDateInput;
