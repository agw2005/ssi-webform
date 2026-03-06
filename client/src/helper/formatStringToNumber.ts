const formatStringToNumber = (s: string): number => {
  const removedCommas = s.replace(/,/g, "");
  const reformattedNumber = parseFloat(removedCommas);
  return isNaN(reformattedNumber) ? 0 : reformattedNumber;
};

export default formatStringToNumber;
