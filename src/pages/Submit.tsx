import Primitive from "../components/Primitive.tsx";
import FirstStep from "../components/FirstStep.tsx";
import SecondStep from "../components/SecondStep.tsx";
import ThirdStep from "../components/ThirdStep.tsx";
import FourthStep from "../components/FourthStep.tsx";
import FifthStep from "../components/FifthStep.tsx";

const Submit = () => {
  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep />
          <SecondStep />
        </div>
        <ThirdStep />
        <div className="flex flex-wrap gap-8">
          <FourthStep />
          <FifthStep />
        </div>
      </div>
    </Primitive>
  );
};

export default Submit;
