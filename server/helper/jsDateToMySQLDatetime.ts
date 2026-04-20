export const jsDateToMySQLDatetime = (inputDate: Date) => {
  return inputDate.toISOString().slice(0, 19).replace("T", " ");
};
