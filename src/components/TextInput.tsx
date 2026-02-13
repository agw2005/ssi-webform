import type { ColorVariant } from "../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";

interface TextInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  isDisabled?: boolean;
}

const TextInput = ({
  label,
  name,
  id,
  variant,
  requiredInput,
  isDisabled = false,
}: TextInputProps) => {
  //ditched dynamic styling with separate color and color intensity.
  //see: https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names

  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <input
        disabled={isDisabled}
        type="text"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border ${resolveColorMappings(variant, "input")} ${isDisabled ? "bg-black/10" : "bg-white/50"} outline-none flex-1`}
      />
    </div>
  );
};

export default TextInput;
