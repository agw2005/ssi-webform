interface TextInputBetweenLabelProps {
  leftLabel: string;
  rightLabel: string;
  name: string;
  id: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
}

const TextInputBetweenLabel = ({
  leftLabel,
  rightLabel,
  name,
  id,
  requiredInput,
  color,
  colorIntensity,
}: TextInputBetweenLabelProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {leftLabel}
        {requiredInput ? "*" : ""}
      </div>
      <input
        type="text"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | h-full px-4 border border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none flex-1`}
      />
      <div
        className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {rightLabel}
      </div>
    </div>
  );
};

export default TextInputBetweenLabel;
