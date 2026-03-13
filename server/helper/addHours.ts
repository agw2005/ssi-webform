const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date); // copy to avoid mutating original
  result.setHours(result.getHours() + hours);
  return result;
};

export default addHours;
