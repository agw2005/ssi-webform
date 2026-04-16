const formatNumberToString = (
  n: number,
  trailingDecimal: number = 2,
): string => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: trailingDecimal,
    maximumFractionDigits: trailingDecimal,
  }).format(n);
  return formattedNumber;
};

export default formatNumberToString;
