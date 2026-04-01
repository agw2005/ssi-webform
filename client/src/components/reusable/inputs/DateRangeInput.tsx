import type { ColorVariant } from "../../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../../helper/tailwindColorResolver.ts";

interface DateRangeInputProps {
  firstLabel?: string;
  secondLabel?: string;
  name: string;
  id: string;
  firstDateRequiredInput: boolean;
  secondDateRequiredInput: boolean;
  variant: ColorVariant;
  isDisabled?: boolean;
  startingDateValue: string;
  endingDateValue: string;
  startingDateOnChangeHandler: (
    input: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  endingOnDateChangeHandler: (
    input: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

const DateRangeInput = ({
  firstLabel = "Date from",
  secondLabel = "to",
  name,
  id,
  variant,
  firstDateRequiredInput,
  secondDateRequiredInput,
  isDisabled = false,
  startingDateValue,
  endingDateValue,
  startingDateOnChangeHandler,
  endingOnDateChangeHandler,
}: DateRangeInputProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center justify-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        {firstLabel}
        {firstDateRequiredInput ? "*" : ""}
      </div>
      <input
        disabled={isDisabled}
        type="date"
        name={`${name}-start`}
        id={`${id}-start`}
        className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 border ${
          resolveColorMappings(variant, "input")
        } bg-white/50 outline-none`}
        value={startingDateValue}
        onChange={startingDateOnChangeHandler}
      />
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold h-full justify-self-center border flex items-center justify-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        {secondLabel}
        {secondDateRequiredInput ? "*" : ""}
      </div>
      <input
        disabled={isDisabled}
        type="date"
        name={`${name}-end`}
        id={`${id}-end`}
        className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border ${
          resolveColorMappings(variant, "input")
        } bg-white/50 outline-none`}
        value={endingDateValue}
        onChange={endingOnDateChangeHandler}
      />
    </div>
  );
};

export default DateRangeInput;
