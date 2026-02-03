import Step4RoleBox from "./Step4RoleBox";

const Step4ApprovalSection = () => {
  return (
    <div className="space-y-6">
      <Step4RoleBox title="Approver" />
      <Step4RoleBox title="Releaser" />
      <Step4RoleBox title="Administrator" />
    </div>
  );
};

export default Step4ApprovalSection;
