export type ColorVariant = "red" | "blue" | "yellow" | "green" | "purple";

export type ComponentPart = "label" | "input";

export const labelColorVariants = {
  red: "border-red-600 bg-red-600",
  blue: "border-blue-600 bg-blue-600",
  yellow: "border-yellow-600 bg-yellow-600",
  green: "border-green-600 bg-green-600",
  purple: "border-purple-600 bg-purple-600",
};

export const inputColorVariants = {
  red: "border-red-600 text-red-600",
  blue: "border-blue-600 text-blue-600",
  yellow: "border-yellow-600 text-yellow-600",
  green: "border-green-600 text-green-600",
  purple: "border-purple-600 text-purple-600",
};

export const resolveColorMappings = (
  variant: ColorVariant,
  part: ComponentPart,
) => {
  try {
    if (part === "label") {
      return labelColorVariants[variant];
    } else if (part === "input") {
      return inputColorVariants[variant];
    } else {
      throw Error(
        "Error when resolving color variant (tailwindColorResolver.ts)",
      );
    }
  } catch (err) {
    console.error(err);
  }
};
