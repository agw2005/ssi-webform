import formatNumberToString from "./formatNumberToString.ts";

const formatNegativeNumber = (num: number) => {
  if (num < 0) {
    return `(${formatNumberToString(-num)})`;
  } else {
    return formatNumberToString(num);
  }
};

export default formatNegativeNumber;
