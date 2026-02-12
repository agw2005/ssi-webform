interface TipBoxProps {
  label: string;
  color: string;
  colorIntensity: string;
}

const TipBox = ({ label, color, colorIntensity }: TipBoxProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm | whitespace-nowrap rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {label}
      </div>
    </div>
  );
};

export default TipBox;
