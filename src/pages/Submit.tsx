import { useRef, useState } from "react";
import Primitive from "../components/Primitive";
import Step1Container from "../components/submit/step1/Step1Container";
import Step1Header from "../components/submit/step1/Step1Header";
import Step1Attention from "../components/submit/step1/Step1Attention";
import Step1Form from "../components/submit/step1/Step1Form";

import Step2Header from "../components/submit/step2/Step2Header";
import Step2Attention from "../components/submit/step2/Step2Attention";
import Step2Form from "../components/submit/step2/Step2Form";

import Step3Header from "../components/submit/step3/Step3Header";
import Step3Attention from "../components/submit/step3/Step3Attention";

import { generateFormNumber } from "../components/Date";
import Step3Form from "../components/submit/step3/Step3Form";

import Step4Form from "../components/submit/step4/Step4Form";

const Submit = () => {
  const [formNumber] = useState(() => generateFormNumber());

  // refs untuk scroll
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Primitive>
      <Step1Container>
        {/* STEP 1 */}
        <div ref={step1Ref} className="bg-white rounded-xl p-8 shadow-sm">
          <Step1Header />
          <Step1Attention />
          <Step1Form onNext={() => scrollTo(step2Ref)} />
        </div>
      </Step1Container>
      <Step1Container>
        {/* STEP 2 */}
        <div ref={step2Ref} className="bg-white rounded-xl p-8 shadow-sm">
          <Step2Header />
          <Step2Attention />
          <Step2Form
            formNumber={formNumber}
            onNext={() => scrollTo(step3Ref)}
            onBack={() => scrollTo(step1Ref)}
          />
        </div>
      </Step1Container>

        {/* STEP 3 */}
        <div ref={step3Ref} className="bg-white rounded-xl p-8 shadow-sm">
          <Step3Header />
          <Step3Attention />
          <Step3Form />
        </div>

        {/* STEP 4 */}
        <Step1Container>
          <Step4Form />
        </Step1Container>

    </Primitive>
  );
};

export default Submit;
