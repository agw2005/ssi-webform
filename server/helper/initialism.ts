export const initialism = (text: string): string => {
  if (!text.trim()) return "";
  return text
    .trim() // remove leading/trailing whitespace
    .split(/\s+/) // split the string to words by one or more spaces
    .map((word) => word[0]) // Get the first char of each word
    .join(""); // recombine the chars into a single string
};
