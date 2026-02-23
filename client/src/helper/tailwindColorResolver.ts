export type ColorVariant =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "purple"
  | "black";

export type ComponentPart =
  | "label"
  | "input"
  | "itemsStorage"
  | "button"
  | "switchOn"
  | "switchOff";

export const labelColorVariants = {
  red: "border-red-600 bg-red-600",
  blue: "border-blue-600 bg-blue-600",
  yellow: "border-yellow-600 bg-yellow-600",
  green: "border-green-600 bg-green-600",
  purple: "border-purple-600 bg-purple-600",
  black: "border-black bg-black",
};

export const inputColorVariants = {
  red: "border-red-600 text-red-600",
  blue: "border-blue-600 text-blue-600",
  yellow: "border-yellow-600 text-yellow-600",
  green: "border-green-600 text-green-600",
  purple: "border-purple-600 text-purple-600",
  black: "border-black text-black",
};

export const itemsStorageColorVariants = {
  red: "border-red-600 bg-white/0",
  blue: "border-blue-600 bg-white/0",
  yellow: "border-yellow-600 bg-white/0",
  green: "border-green-600 bg-white/0",
  purple: "border-purple-600 bg-white/0",
  black: "border-black bg-white/0",
};

export const buttonColorVariants = {
  red: "border-red-600 bg-red-600 hover:bg-red-600/70 active:bg-red-600/85",
  blue: "border-blue-600 bg-blue-600 hover:bg-blue-600/70 active:bg-blue-600/85",
  yellow:
    "border-yellow-600 bg-yellow-600 hover:bg-yellow-600/70 active:bg-yellow-600/85",
  green:
    "border-green-600 bg-green-600 hover:bg-green-600/70 active:bg-green-600/85",
  purple:
    "border-purple-600 bg-purple-600 hover:bg-purple-600/70 active:bg-purple-600/85",
  black:
    "border-black bg-black hover:bg-black/70 active:bg-black/85 text-white",
};

export const switchOnColorVariants = {
  red: "border-red-600 bg-red-600 text-white",
  blue: "border-blue-600 bg-blue-600 text-white",
  yellow: "border-yellow-600 bg-yellow-600 text-white",
  green: "border-green-600 bg-green-600 text-white",
  purple: "border-purple-600 bg-purple-600 text-white",
  black: "border-black bg-black text-white",
};

export const switchOffColorVariants = {
  red: "border-red-600 bg-red-600/0 text-red-600 hover:text-red-600 hover:bg-red-600/20",
  blue: "border-blue-600 bg-blue-600/0 text-blue-600 hover:text-blue-600 hover:bg-blue-600/20",
  yellow:
    "border-yellow-600 bg-yellow-600/0 text-yellow-600 hover:text-yellow-600 hover:bg-yellow-600/20",
  green:
    "border-green-600 bg-green-600/0 text-green-600 hover:text-green-600 hover:bg-green-600/20",
  purple:
    "border-purple-600 bg-purple-600/0 text-purple-600 hover:text-purple-600 hover:bg-purple-600/20",
  black:
    "border-black bg-white/0 text-black hover:text-white hover:bg-black/50",
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
    } else if (part === "itemsStorage") {
      return itemsStorageColorVariants[variant];
    } else if (part === "button") {
      return buttonColorVariants[variant];
    } else if (part === "switchOn") {
      return switchOnColorVariants[variant];
    } else if (part === "switchOff") {
      return switchOffColorVariants[variant];
    } else {
      throw Error("Selected color variant or part does not exist");
    }
  } catch (err) {
    console.error(err);
  }
};
