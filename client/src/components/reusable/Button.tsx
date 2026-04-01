import {
  type ColorVariant,
  resolveColorMappings,
} from "../../helper/tailwindColorResolver.ts";

interface ButtonProps {
  id: string;
  variant: ColorVariant;
  label: string;
}

const Button = ({ id, variant, label }: ButtonProps) => {
  return (
    <div
      id={id}
      className={`${
        resolveColorMappings(variant, "button")
      } | h-8 lg:h-9 xl:h-10 | text-xs lg:text-sm xl:text-base | whitespace-nowrap flex items-center justify-center font-bold px-4 py-2 border rounded-2xl select-none`}
    >
      {label}
    </div>
  );
};

export default Button;
