import { useState, useRef } from "react";
import Primitive from "../components/Primitive";

import Step1Container from "../components/submit/step1/Step1Container";
import Step1Header from "../components/submit/step1/Step1Header";
import Step1Attention from "../components/submit/step1/Step1Attention";
import Step1Form from "../components/submit/step1/Step1Form";

import Step2Container from "../components/submit/step2/Step2Container";
import Step2Header from "../components/submit/step2/Step2Header";
import Step2Attention from "../components/submit/step2/Step2Attention";
import Step2Form from "../components/submit/step2/Step2Form";

import { generateFormNumber } from "../components/Date";

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

    </Primitive>
  );
};

export default Submit;
