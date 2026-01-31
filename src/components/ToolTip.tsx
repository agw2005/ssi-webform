interface ToolTipProps {
  text: string;
  underline?: boolean;
  select?: boolean;
  children: React.ReactNode;
}

const ToolTip = ({
  children,
  text,
  underline = true,
  select = true,
}: ToolTipProps) => {
  return (
    <div className="relative group">
      <p
        className={`text-center ${underline ? "underline decoration-dotted underline-offset-4 decoration-2" : ""} ${select ? "select-none" : ""}`}
      >
        {text}
      </p>
      <div className="absolute top-7.5 -left-1/4 opacity-0 pointer-events-none group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
};

export default ToolTip;
