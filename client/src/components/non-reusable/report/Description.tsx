import capitalize from "../../../helper/capitalize.ts";
import extractMonthFromFullPeriode from "../../../helper/extractMonthFromFullPeriode.ts";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const Description = {
  general: (fileResource: string) => (
    <>
      <div className="text-sm font-medium flex gap-4">
        <h3>File Resource :</h3>{" "}
        <h3>{fileResource === "Show All" ? "%" : fileResource}</h3>
      </div>
    </>
  ),
  byQuarter: (fileResource: string, month: string) => (
    <div className="flex gap-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">File Resource :</h3>
        <h3 className="text-sm font-medium">Month :</h3>
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{fileResource}</h3>
        <h3 className="text-sm font-medium">
          {capitalize(MONTHS[Number(extractMonthFromFullPeriode(month)) - 1])}
        </h3>
      </div>
    </div>
  ),
  empty: () => <div></div>,
};

export default Description;
