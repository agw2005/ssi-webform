import type { ColorVariant } from "../../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../../helper/tailwindColorResolver.ts";

interface NumberInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  isDisabled?: boolean;
  minimumValue?: number;
  maximumValue?: number;
  value: string;
  onChangeHandler: (input: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberInput = ({
  label,
  name,
  id,
  variant,
  requiredInput,
  isDisabled = false,
  minimumValue = 0,
  maximumValue = Number.MAX_SAFE_INTEGER,
  value,
  onChangeHandler,
}: NumberInputProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <input
        min={minimumValue}
        max={maximumValue}
        disabled={isDisabled}
        type="number"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border ${resolveColorMappings(variant, "input")} bg-white/50 outline-none`}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default NumberInput;
