import type { ColorVariant } from "../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";

interface TipBoxProps {
  label: string;
  variant: ColorVariant;
}

const TipBox = ({ label, variant }: TipBoxProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm | whitespace-nowrap rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
      >
        {label}
      </div>
    </div>
  );
};

export default TipBox;
