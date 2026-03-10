import dateSplitter from "./dateSplitter.ts";
import getCurrentPeriod from "./getCurrentPeriod.ts";
import getPeriodHalves from "./getPeriodHalves.ts";

const getStartingMonthPeriodOfMonthReport = (
  yearMonth: string,
): [number, string] => {
  const lhResult: [number, string] = [10, "OCTOBER"];
  const fhResult: [number, string] = [4, "APRIL"];

  const [paramYear, paramMonth] = dateSplitter(yearMonth + "-00");
  const derivedPeriod = getCurrentPeriod(Number(paramYear), Number(paramMonth));
  const halves = getPeriodHalves(derivedPeriod);
  return halves === "FH" ? fhResult : lhResult;
};

export default getStartingMonthPeriodOfMonthReport;
