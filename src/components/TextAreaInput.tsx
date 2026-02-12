interface TextAreaInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
  isDisabled?: boolean;
}

const TextAreaInput = ({
  label,
  name,
  id,
  requiredInput,
  color,
  colorIntensity,
  isDisabled = false,
}: TextAreaInputProps) => {
  return (
    <div className="flex flex-col">
      <div
        className={`text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | w-max font-bold rounded-t-xl justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <textarea
        disabled={isDisabled}
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | h-32 px-4 py-2 w-full rounded-bl-xl rounded-br-xl rounded-tr-xl border border-${color}-${colorIntensity} text-${color}-${colorIntensity} ${isDisabled ? "bg-black/10" : "bg-white/50"} outline-none`}
      />
    </div>
  );
};

export default TextAreaInput;
