import { resolveColorMappings } from "../../helper/tailwindColorResolver.ts";
import type { ColorVariant } from "../../helper/tailwindColorResolver.ts";

interface SwitchProps<T extends string> {
  id: string;
  variant: ColorVariant;
  onValue: T;
  offValue: T;
  onLabel: string;
  offLabel: string;
  setter: (value: React.SetStateAction<T>) => void;
  getter: T;
}

const Switch = <T extends string>({
  id,
  variant,
  onValue,
  offValue,
  onLabel,
  offLabel,
  setter,
  getter,
}: SwitchProps<T>) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max" id={id}>
      <div
        onClick={() => {
          setter(onValue);
        }}
        className={`text-xs lg:text-sm xl:text-base | ${getter !== offValue ? resolveColorMappings(variant, "switchOn") : resolveColorMappings(variant, "switchOff")} font-bold tracking-wide rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 select-none`}
      >
        {onLabel}
      </div>
      <div
        onClick={() => {
          setter(offValue);
        }}
        className={`text-xs lg:text-sm xl:text-base | ${getter !== onValue ? resolveColorMappings(variant, "switchOn") : resolveColorMappings(variant, "switchOff")} font-bold tracking-wide rounded-r-xl h-full justify-self-center border flex items-center px-2 select-none`}
      >
        {offLabel}
      </div>
    </div>
  );
};

export default Switch;
