export const onlyNumerics = (str: string): string => {
  return str.replace(/\D+/g, "");
};
