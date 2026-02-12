interface TextInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
}

const TextInput = ({
  label,
  name,
  id,
  color,
  colorIntensity,
  requiredInput,
}: TextInputProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <input
        type="text"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none flex-1`}
      />
    </div>
  );
};

export default TextInput;
