import type { ColorVariant } from "../../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../../helper/tailwindColorResolver.ts";

interface TextInputBetweenLabelProps {
  leftLabel: string;
  rightLabel: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  value: string;
  onChangeHandler: (input: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const TextInputBetweenLabel = ({
  leftLabel,
  rightLabel,
  name,
  id,
  requiredInput,
  variant,
  value,
  onChangeHandler,
  placeholder = "",
}: TextInputBetweenLabelProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        {leftLabel}
        {requiredInput ? "*" : ""}
      </div>
      <input
        placeholder={placeholder}
        type="text"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | h-full px-4 border ${
          resolveColorMappings(variant, "input")
        } bg-white/50 outline-none flex-1`}
        value={value}
        onChange={onChangeHandler}
      />
      <div
        className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        {rightLabel}
      </div>
    </div>
  );
};

export default TextInputBetweenLabel;
