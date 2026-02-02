interface Props {
  children: React.ReactNode;
}

const Form1Container = ({ children }: Props) => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-12 py-10">
      <div className="flex flex-col gap-10">
        {children}
      </div>
    </div>
  );
};

export default Form1Container;
