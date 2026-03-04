const formatNumberToString = (n: number): string => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return formattedNumber;
};

export default formatNumberToString;
