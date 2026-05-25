import formatNumberToString from "./formatNumberToString.ts";

const formatNegativeNumber = (num: number, extra: string = ""): string => {
  if (num < 0) {
    return `(${formatNumberToString(-num)}${extra})`;
  } else if (num >= 0) {
    return `${formatNumberToString(num)}${extra}`;
  } else {
    return "N/A";
  }
};

export default formatNegativeNumber;
