import {
  type ColorVariant,
  resolveColorMappings,
} from "../../helper/tailwindColorResolver.ts";

export interface SwitchOption<T extends string> {
  value: T;
  label: string;
}

interface MultiswitchProps<T extends string> {
  id: string;
  variant: ColorVariant;
  options: SwitchOption<T>[];
  value: T;
  setter: (value: React.SetStateAction<T>) => void;
}

const Multiswitch = <T extends string>({
  id,
  variant,
  options,
  value,
  setter,
}: MultiswitchProps<T>) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max" id={id}>
      {options.map((option, index) => {
        const isActive = value === option.value;

        return (
          <div
            key={index}
            onClick={() => setter(option.value)}
            className={`
              text-xs lg:text-sm xl:text-base | 
              ${
              isActive
                ? resolveColorMappings(variant, "switchOn")
                : resolveColorMappings(variant, "switchOff")
            }
              font-bold tracking-wide h-full flex items-center px-2 select-none border
              ${index === 0 ? "rounded-l-xl border-r-0" : ""}
              ${index === options.length - 1 ? "rounded-r-xl" : "border-r-0"}
            `}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export default Multiswitch;
