interface DateInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
  isDisabled?: boolean;
}

const DateInput = ({
  label,
  name,
  id,
  color,
  colorIntensity,
  requiredInput,
  isDisabled = false,
}: DateInputProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center justify-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <input
        disabled={isDisabled}
        type="date"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none`}
      />
    </div>
  );
};

export default DateInput;
