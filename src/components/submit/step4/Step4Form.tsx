import Step4Header from "./Step4Header";
import Step4Attention from "./Step4Attention";
import Step4ApprovalSection from "./Step4ApprovalSection";

const Step4Form = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <Step4Header />
      <Step4Attention />
      <Step4ApprovalSection />
    </div>
  );
};

export default Step4Form;
