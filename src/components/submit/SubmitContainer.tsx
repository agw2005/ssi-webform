import React from "react";

interface Props {
  children: React.ReactNode;
}

const SubmitContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-12 py-10">
      <div className="flex gap-10 items-start">
        {children}
      </div>
    </div>
  );
};

export default SubmitContainer;
