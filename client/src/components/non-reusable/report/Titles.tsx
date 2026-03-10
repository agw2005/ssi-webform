import extractMonthFromFullPeriode from "../../../helper/extractMonthFromFullPeriode.ts";
import extractYearFromFullPeriode from "../../../helper/extractYearFromFullPeriode.ts";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";

const Titles = {
  general: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">
        BUDGET USAGE SUPPLIES, FIX AND REPAIR
      </h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
  byQuarter: (desc: string, month: string) => (
    <>
      <h1 className="text-xl font-bold">{`REPORT BUDGET ${desc}`}</h1>
      <h2 className="text-xl font-bold">
        {getCurrentPeriod(
          Number(extractYearFromFullPeriode(month)),
          Number(extractMonthFromFullPeriode(month)),
        ).substring(0, 5)}
      </h2>
    </>
  ),
  bySection: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">EXPENSES BUDGET REPORT</h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
  byNature: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">EXPENSES BUDGET REPORT</h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
};

export default Titles;
