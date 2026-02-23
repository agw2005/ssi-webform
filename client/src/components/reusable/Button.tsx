import {
  resolveColorMappings,
  type ColorVariant,
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
      className={`${resolveColorMappings(variant, "button")} | px-4 py-2 border rounded-2xl select-none`}
    >
      {label}
    </div>
  );
};

export default Button;
