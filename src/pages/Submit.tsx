import { useState, useRef } from "react";
import Primitive from "../components/Primitive.tsx";

import Step1Container from "../components/submit/step1/Step1Container.tsx";
import Step1Header from "../components/submit/step1/Step1Header.tsx";
import Step1Attention from "../components/submit/step1/Step1Attention.tsx";
import Step1Form from "../components/submit/step1/Step1Form.tsx";

import Step2Container from "../components/submit/step2/Step2Container.tsx";
import Step2Header from "../components/submit/step2/Step2Header.tsx";
import Step2Attention from "../components/submit/step2/Step2Attention.tsx";
import Step2Form from "../components/submit/step2/Step2Form.tsx";

import Step3Header from "../components/submit/step3/Step3Header.tsx";
import Step3Attention from "../components/submit/step3/Step3Attention.tsx";
import Step3Form from "../components/submit/step3/Step3Form.tsx";

import { generateFormNumber } from "../components/Date.tsx";

const Submit = () => {
  const [formNumber] = useState<string>(() => generateFormNumber());

  // ref untuk scroll
  const step2Ref = useRef<HTMLDivElement | null>(null);

  const scrollToStep2 = () => {
    step2Ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Primitive>
      
      {/* STEP 1 */}
      <Step1Container>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <Step1Header />
          <Step1Attention />
          <Step1Form onNext={scrollToStep2} />
        </div>
      </Step1Container>

      {/* STEP 2 */}
      <div ref={step2Ref}>
        <Step2Container>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <Step2Header />
            <Step2Attention />
            <Step2Form formNumber={formNumber} />
          </div>
        </Step2Container>
      </div>

      {/* STEP 3 */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <Step3Header />
        <Step3Attention />
        <Step3Form />
      </div>

    </Primitive>
  );
};

export default Submit;
