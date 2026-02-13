import Primitive from "../components/Primitive.tsx";
import FirstStep from "../components/FirstStep.tsx";
import SecondStep from "../components/SecondStep.tsx";
import ThirdStep from "../components/ThirdStep.tsx";
import FourthStep from "../components/FourthStep.tsx";
import FifthStep from "../components/FifthStep.tsx";
import { useState } from "react";

const PROGRESS_CONSTRAINT = {
  FIRST_STEP: [1],
  SECOND_STEP: [1, 2],
  THIRD_STEP: [1, 2, 3],
  FOURTH_STEP: [1, 2, 3, 4],
};

const evaluateConstraint = (totalProgress: number[], constraint: number[]) => {
  return constraint.every((step) => totalProgress.includes(step));
};

const Submit = () => {
  const [progress, setProgress] = useState<number[]>([]);

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep progressSetter={setProgress} />
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FIRST_STEP) ? (
            <SecondStep progressSetter={setProgress} />
          ) : (
            ""
          )}
        </div>
        {evaluateConstraint(progress, PROGRESS_CONSTRAINT.SECOND_STEP) ? (
          <ThirdStep progressSetter={setProgress} />
        ) : (
          ""
        )}
        <div className="flex flex-wrap gap-8">
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.THIRD_STEP) ? (
            <FourthStep progressSetter={setProgress} />
          ) : (
            ""
          )}
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FOURTH_STEP) ? (
            <FifthStep />
          ) : (
            ""
          )}
        </div>
      </div>
    </Primitive>
  );
};

export default Submit;
