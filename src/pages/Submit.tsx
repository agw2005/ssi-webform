import { useRef, useState } from "react";
import Primitive from "../components/Primitive.tsx";
import Step1Header from "../components/submit/step1/Step1Header.tsx";
import Step1Attention from "../components/submit/step1/Step1Attention.tsx";
import Step1Form from "../components/submit/step1/Step1Form.tsx";

import Step2Header from "../components/submit/step2/Step2Header.tsx";
import Step2Attention from "../components/submit/step2/Step2Attention.tsx";
import Step2Form from "../components/submit/step2/Step2Form.tsx";

import Step3Header from "../components/submit/step3/Step3Header.tsx";
import Step3Attention from "../components/submit/step3/Step3Attention.tsx";

import { generateFormNumber } from "../components/Date.tsx";
import Step3Form from "../components/submit/step3/Step3Form.tsx";

import Step4Form from "../components/submit/step4/Step4Form.tsx";

import LastStepForm from "../components/submit/step5/LastStepForm.tsx";

const Submit = () => {
  const [formNumber] = useState(() => generateFormNumber());

  // refs untuk scroll
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Primitive>
        {/* STEP 1 */}
        <div ref={step1Ref} className="bg-white rounded-xl p-8 shadow-sm">
          <Step1Header />
          <Step1Attention />
          <Step1Form onNext={() => scrollTo(step2Ref)} />
        </div>
      
    
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
      

        {/* STEP 3 */}
        <div ref={step3Ref} className="bg-white rounded-xl p-8 shadow-sm">
          <Step3Header />
          <Step3Attention />
          <Step3Form
          onNext={() => scrollTo(step4Ref)}
          onBack={() => scrollTo(step2Ref)}          
          />
        </div>

        {/* STEP 4 */}
        <div ref={step4Ref} className="bg-white rounded-xl p-8 shadow-sm mt-8">
          <Step4Form 
          onBack={() => scrollTo(step3Ref)}
          onNext={() => scrollTo(step5Ref)}
          />
        </div>

        {/* Last Step */}
        <div ref={step5Ref} className="bg-white rounded-xl p-8 shadow-sm mt-8">
          <LastStepForm onBack={() => scrollTo(step4Ref)} />
        </div>
    </Primitive>
  );
};

export default Submit;
