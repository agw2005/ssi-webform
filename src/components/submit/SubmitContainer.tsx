const SubmitContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-4xl bg-gray-100 p-6 rounded-md">
      {children}
    </div>
  );
};

export default SubmitContainer;