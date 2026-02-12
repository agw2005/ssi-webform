import Primitive from "../components/Primitive.tsx";
import FirstStep from "../components/FirstStep.tsx";
import SecondStep from "../components/SecondStep.tsx";
import ThirdStep from "../components/ThirdStep.tsx";
import FourthStep from "../components/FourthStep.tsx";
import FifthStep from "../components/FifthStep.tsx";
import { useState } from "react";

const Submit = () => {
  const [progress, setProgress] = useState<number[]>([]);

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep progressSetter={setProgress} />
          {[1].every((step) => progress.includes(step)) ? (
            <SecondStep progressSetter={setProgress} />
          ) : (
            ""
          )}
        </div>
        {[1, 2].every((step) => progress.includes(step)) ? (
          <ThirdStep progressSetter={setProgress} />
        ) : (
          ""
        )}
        <div className="flex flex-wrap gap-8">
          {[1, 2, 3].every((step) => progress.includes(step)) ? (
            <FourthStep progressSetter={setProgress} />
          ) : (
            ""
          )}
          {[1, 2, 3, 4].every((step) => progress.includes(step)) ? (
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
