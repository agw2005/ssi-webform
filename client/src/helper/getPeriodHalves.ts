const getPeriodHalves = (period: string): "LH" | "FH" => {
  const result: "LH" | "FH" = period.substring(4, 6) as "LH" | "FH";
  return result;
};

export default getPeriodHalves;
