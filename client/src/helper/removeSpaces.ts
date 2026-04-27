/**
 * Removes all spaces and tabs from a given string.
 * @param input - The string to be cleaned.
 * @returns A new string without spaces or tabs.
 */
export const removeWhitespace = (input: string): string => {
  return input.replace(/[ \t]/g, "");
};
