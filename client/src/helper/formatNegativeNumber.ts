import formatNumberToString from "./formatNumberToString.ts";

const formatNegativeNumber = (num: number, extra: string = "") => {
  if (num < 0) {
    return `(${formatNumberToString(-num)}${extra})`;
  } else {
    return `${formatNumberToString(num)}${extra}`;
  }
};

export default formatNegativeNumber;
